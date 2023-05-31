// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

import {ILilyERC20, LilyERC20} from "Lily/ERC/ERC20/LilyERC20.sol";
import {LilyERC20Airdrop} from "Lily/ERC/ERC20/utils/LilyERC20Airdrop.sol";

import {ILilyERC20Airdrop_Test} from "./ILilyERC20Airdrop.t.sol";

contract LilyERC20Airdrop_Test is Test, ILilyERC20Airdrop_Test {
    LilyERC20 public lilyERC20;
    LilyERC20Airdrop public airdropper;

    uint256 airdropAmount = 100_000;

    function setUp() public {
        lilyERC20 = new LilyERC20(NAME, SYMBOL, INITIAL_SUPPLY, CAP);
        airdropper = new LilyERC20Airdrop();
    }

    /**
     * An empty array.
     * Should revert.
     */
    function test_airdrop_EmptyAirdropArray_ShouldRevert() public {
        ERC20Package[] memory values = new ERC20Package[](0);
        vm.expectRevert(AirdropLengthInvalid.selector);
        airdropper.airdrop(lilyERC20, values);
    }

    /**
     * An array larger than the MAX_DROPS permits.
     * Should revert.
     */
    function test_airdrop_ArrayLargerThanMaxDrops_ShouldRevert() public {
        ERC20Package[] memory values = new ERC20Package[](
            airdropper.MAX_DROPS() + 1
        );
        vm.expectRevert(AirdropLengthInvalid.selector);
        airdropper.airdrop(lilyERC20, values);
    }

    /**
     * An insufficient allowance.
     * Should revert.
     */
    function test_airdrop_InsufficientAllowance_ShouldRevert() public {
        ERC20Package[] memory values = new ERC20Package[](1);
        values[0] = ERC20Package(w_main, airdropAmount);
        vm.expectRevert("ERC20: insufficient allowance");
        airdropper.airdrop(lilyERC20, values);
    }

    /**
     * An array with a zero address.
     * Should revert.
     */
    function test_airdrop_ArrayWithZeroAddress_ShouldRevert() public {
        ERC20Package[] memory values = new ERC20Package[](1);
        values[0] = ERC20Package(address(0), airdropAmount);
        lilyERC20.increaseAllowance(
            address(airdropper),
            airdropAmount * values.length
        );
        vm.expectRevert("ERC20: transfer to the zero address");
        airdropper.airdrop(lilyERC20, values);
    }

    /**
     * An array with a zero value.
     * Should revert.
     */
    function test_airdrop_ArrayWithZeroValue_ShouldRevert() public {
        ERC20Package[] memory values = new ERC20Package[](1);
        values[0] = ERC20Package(w_main, 0);
        lilyERC20.increaseAllowance(
            address(airdropper),
            airdropAmount * values.length
        );
        vm.expectRevert(ZeroBalanceTransfer.selector);
        airdropper.airdrop(lilyERC20, values);
    }

    function test_airdrop_shouldPass() public {
        uint256 totalAirdroppedValue;
        ERC20Package[] memory values = new ERC20Package[](addrs.length);
        for (uint256 i; i < addrs.length; i++) {
            values[i] = ERC20Package(addrs[i], airdropAmount);
            totalAirdroppedValue += airdropAmount;
        }

        if (
            !lilyERC20.increaseAllowance(
                address(airdropper),
                totalAirdroppedValue
            )
        ) {
            revert();
        }

        // Execute drop.

        airdropper.airdrop(lilyERC20, values);

        // Asserts
        assertEq(
            lilyERC20.balanceOf(address(this)),
            INITIAL_SUPPLY - totalAirdroppedValue
        );

        for (uint256 i; i < addrs.length; i++) {
            assertEq(lilyERC20.balanceOf(addrs[i]), airdropAmount);
        }
    }

    function testFuzz_airdrop(address[] calldata recipients) public {
        ERC20Package[] memory package = new ERC20Package[](recipients.length);

        vm.assume(recipients.length > 0);
        vm.assume(recipients.length <= airdropper.MAX_DROPS());

        // Assume none are zero address
        for (uint256 i; i < recipients.length; i++) {
            vm.assume(recipients[i] != address(0));
            // Assume no repeats
            for (uint256 j; j < i; j++) {
                vm.assume(recipients[i] != recipients[j]);
            }
        }

        uint256 totalAirdroppedValue;

        for (uint256 i = 0; i < recipients.length; i++) {
            package[i] = ERC20Package(recipients[i], airdropAmount);
            totalAirdroppedValue += airdropAmount;
        }

        lilyERC20.increaseAllowance(
            address(airdropper),
            totalAirdroppedValue
        );

        airdropper.airdrop(lilyERC20, package);

        assertEq(
            lilyERC20.balanceOf(address(this)),
            INITIAL_SUPPLY - totalAirdroppedValue
        );

        for (uint256 i; i < package.length; i++) {
            assertEq(
                lilyERC20.balanceOf(package[i].recipient),
                package[i].value
            );
        }
    }
}
