// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";

import {LilyPayable} from "Lily/utils/LilyPayable.sol";

contract LilyPayable_Test is Test {
    LilyPayable public lilyPayable;
    event Withdrawn(address indexed, uint256 indexed);

    // Needed so the test contract itself can receive ether when withdrawing
    receive() external payable {}

    function setUp() public {
        lilyPayable = new LilyPayable();
    }

    function test_withdraw() public {
        payable(address(lilyPayable)).transfer(1 ether);
        uint256 balance = address(lilyPayable).balance;
        assertEq(balance, 1 ether);

        vm.expectEmit(true, true, false, false);
        emit Withdrawn(address(this), 1 ether);
        lilyPayable.withdraw();

        balance = address(lilyPayable).balance;
        assertEq(balance, 0);
    }

    function testFuzz_Withdraw(uint96 amount) public {
        payable(address(lilyPayable)).transfer(amount);
        uint256 preBalance = address(this).balance;
        lilyPayable.withdraw();
        uint256 postBalance = address(this).balance;
        assertEq(preBalance + amount, postBalance);
    }
}
