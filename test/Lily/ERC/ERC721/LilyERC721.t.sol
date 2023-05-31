// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

import {ILilyERC721, LilyERC721} from "Lily/ERC/ERC721/LilyERC721.sol";

import {ILilyERC721_Test} from "./ILilyERC721.t.sol";

contract LilyERC721_Test is Test, ILilyERC721_Test {
    using Strings for uint256;

    LilyERC721 public lilyERC721;

    function setUp() public {
        lilyERC721 = new LilyERC721(NAME, SYMBOL, MAX_SUPPLY, BASE_URI);
    }

    function test_get_token_id_counter() public {
        uint32 tokenIdCounter = lilyERC721.tokenIdCounter();
        assertEq(tokenIdCounter, 0);
    }

    function test_InheritedContractChangestokenIdCounter() public {
        lilyERC721.setPublicMintEnabled(true);
        lilyERC721.tokenIdCounter();
    }

    //#region Max Supply
    function test_maxSupply() public {
        uint256 maxSupply = lilyERC721.maxSupply();
        assertEq(maxSupply, MAX_SUPPLY);
    }

    function testFuzz_SetMaxSupply(uint32 amount) public {
        uint32 existingMaxSupply = lilyERC721.maxSupply();
        uint256 currentSupply = lilyERC721.totalSupply();
        uint32 ceiling = lilyERC721.SUPPLY_CEILING();

        // A negative amount, should revert.
        if (amount < 0) {
            vm.expectRevert(ILilyERC721.MaxSupply_Invalid.selector);
            lilyERC721.setMaxSupply(amount);

            uint32 postMaxSupply = lilyERC721.maxSupply();
            assertEq(existingMaxSupply, postMaxSupply);
        }
        // Less than the existing max supply, and less than the current supply, should revert.
        else if (amount < existingMaxSupply && amount < currentSupply) {
            vm.expectRevert(ILilyERC721.MaxSupply_Invalid.selector);
            lilyERC721.setMaxSupply(amount);

            uint32 postMaxSupply = lilyERC721.maxSupply();
            assertEq(existingMaxSupply, postMaxSupply);
        }
        // Greater than the existing max supply and less than ceiling, should pass.
        else if (amount > existingMaxSupply && amount <= ceiling) {
            lilyERC721.setMaxSupply(amount);
            uint32 postMaxSupply = lilyERC721.maxSupply();
            assertEq(amount, postMaxSupply);
        }
        // Greater than the ceiling, should revert.
        else if (amount > ceiling) {
            vm.expectRevert(ILilyERC721.MaxSupply_Invalid.selector);
            lilyERC721.setMaxSupply(amount);

            uint32 postMaxSupply = lilyERC721.maxSupply();
            assertEq(existingMaxSupply, postMaxSupply);
        }
        // Greater than 0 and less than the current supply, should revert.
        else if (amount > 0 && amount < currentSupply) {
            vm.expectRevert(ILilyERC721.MaxSupply_Invalid.selector);
            lilyERC721.setMaxSupply(amount);
            uint32 postMaxSupply = lilyERC721.maxSupply();
            assertEq(existingMaxSupply, postMaxSupply);
        }
        // Equal to zero, should revert.
        else if (amount == 0) {
            vm.expectRevert(ILilyERC721.MaxSupply_Invalid.selector);
            lilyERC721.setMaxSupply(amount);
            uint32 postMaxSupply = lilyERC721.maxSupply();
            assertEq(existingMaxSupply, postMaxSupply);
        } else {
            lilyERC721.setMaxSupply(amount);
            uint32 postMaxSupply = lilyERC721.maxSupply();
            assertEq(amount, postMaxSupply);
        }
    }

    function test_setMaxSupply() public {
        uint32 test_max_supply = 200;

        vm.expectEmit(true, false, false, false, address(lilyERC721));
        emit MaxSupplyChanged(test_max_supply);
        lilyERC721.setMaxSupply(test_max_supply);

        uint32 maxSupply = lilyERC721.maxSupply();
        console.log("maxSupply: %s", uint256(maxSupply).toString());
        assertEq(maxSupply, test_max_supply);
    }

    //#endregion

    //#region URI

    function testFuzz_SetBaseURI(string memory uri) public {
        vm.expectEmit(true, false, false, false);
        emit BaseURIChanged(uri);
        lilyERC721.setBaseURI(uri);

        string memory postBaseURI = lilyERC721.baseURI();
        assertEq(postBaseURI, uri);
    }

    function test_baseURI() public {
        string memory uri = lilyERC721.baseURI();
        assertEq(uri, BASE_URI);
    }

    function test_setBaseURI_AsNonOwner() public {
        vm.prank(address(lilyERC721));
        vm.expectRevert("Ownable: caller is not the owner");
        lilyERC721.setBaseURI("https://lily.com/");
    }

    //#endregion

    //#region setPublicMintEnabled
    function test_setPublicMintEnabled() public {
        bool prepublicMintEnabled = lilyERC721.publicMintEnabled();
        assertEq(prepublicMintEnabled, false);

        lilyERC721.setPublicMintEnabled(true);
        bool postpublicMintEnabled = lilyERC721.publicMintEnabled();
        assertEq(postpublicMintEnabled, true);
    }

    function test_setPublicMintEnabled_asNonOwner() public {
        vm.prank(address(lilyERC721));
        vm.expectRevert("Ownable: caller is not the owner");
        lilyERC721.setPublicMintEnabled(true);
    }

    //#endregion

    //#region mint
    function test_mint_whenPublicMintIsDisabled_andNotPaused() public {
        vm.expectRevert(
            abi.encodeWithSelector(ILilyERC721.PublicMintDisabled.selector)
        );
        lilyERC721.mint();
    }

    function test_mint_whenPublicMintIsEnabled_andPaused() public {
        lilyERC721.pause();
        lilyERC721.setPublicMintEnabled(true);
        vm.expectRevert("Pausable: paused");
        lilyERC721.mint();
    }

    function test_mint_1() public {
        lilyERC721.setPublicMintEnabled(true);
        uint256 tokenId = lilyERC721.mint();
        assertEq(tokenId, 1);
    }

    // function test_mint_100() public {
    //     lilyERC721.setPublicMintEnabled(true);
    //     uint256 totalSupply = lilyERC721.totalSupply();
    //     assertEq(totalSupply, 0);
    //     for (uint256 i; i < 100; i++) {
    //         lilyERC721.mint();
    //         uint256 tokenId = lilyERC721.tokenIdCounter();
    //         string memory tokenURI = lilyERC721.tokenURI(i + 1);
    //         string memory expectedTokenURI = string(
    //             abi.encodePacked(BASE_URI, tokenId.toString())
    //         );
    //         assertEq(tokenURI, expectedTokenURI);
    //     }
    //     totalSupply = lilyERC721.totalSupply();
    //     assertEq(totalSupply, 100);
    // }

    // function test_mint_101() public {
    //     lilyERC721.setPublicMintEnabled(true);
    //     uint256 totalSupply = lilyERC721.totalSupply();
    //     assertEq(totalSupply, 0);
    //     for (uint256 i; i < 100; i++) {
    //         lilyERC721.mint();
    //     }
    //     totalSupply = lilyERC721.totalSupply();
    //     assertEq(totalSupply, 100);
    //     vm.expectRevert(
    //         abi.encodeWithSelector(ILilyERC721.MaxSupply_Invalid.selector)
    //     );
    //     lilyERC721.mint();
    // }

    // function test_mint_supplyCeiling() public {
    //     lilyERC721.setPublicMintEnabled(true);
    //     uint256 ceiling = lilyERC721.SUPPLY_CEILING();
    //     lilyERC721.setMaxSupply(uint256(ceiling));
    //     assertEq(ceiling, 1_000_000);
    //     for (uint256 i; i < ceiling; i++) {
    //         lilyERC721.mint();
    //     }
    //     uint256 totalSupply = lilyERC721.totalSupply();
    //     assertEq(totalSupply, ceiling);
    //     vm.expectRevert("LilyERC721: Max supply reached.");
    //     lilyERC721.mint();
    // }

    //#endregion

    //#region burn status

    function test_burnEnabled() public {
        bool burnStatus = lilyERC721.burnEnabled();
        assertEq(burnStatus, false);
    }

    function test_setBurnEnabled() public {
        bool preBurnStatus = lilyERC721.burnEnabled();
        assertEq(preBurnStatus, false);

        lilyERC721.setBurnEnabled(true);
        bool postBurnStatus = lilyERC721.burnEnabled();
        assertEq(postBurnStatus, true);
    }

    function test_setBurnEnabled_AsNonOwner() public {
        vm.prank(address(lilyERC721));
        vm.expectRevert("Ownable: caller is not the owner");
        lilyERC721.setBurnEnabled(true);
    }

    //#endregion

    //#region burn

    function test_burn_whenBurnIsDisabled() public {
        vm.expectRevert(
            abi.encodeWithSelector(ILilyERC721.BurnDisabled.selector)
        );
        lilyERC721.burn(1);
    }

    function test_burn_whenBurnIsEnabled_andPaused() public {
        lilyERC721.setBurnEnabled(true);
        lilyERC721.pause();
        vm.expectRevert("Pausable: paused");
        lilyERC721.burn(1);
    }

    function test_burn_whenBurnIsEnabled() public {
        lilyERC721.setBurnEnabled(true);
        lilyERC721.setPublicMintEnabled(true);
        lilyERC721.mint();

        uint256 totalSupply = lilyERC721.totalSupply();
        uint256 token_id_counter = lilyERC721.tokenIdCounter();
        assertEq(totalSupply, 1);
        assertEq(token_id_counter, 1);

        lilyERC721.burn(1);
        token_id_counter = lilyERC721.tokenIdCounter();
        totalSupply = lilyERC721.totalSupply();
        assertEq(totalSupply, 0);
        assertEq(token_id_counter, 1);
    }

    function test_burn_AnotherAccountsToken() public {
        lilyERC721.setBurnEnabled(true);
        lilyERC721.setPublicMintEnabled(true);
        lilyERC721.mint();

        uint256 totalSupply = lilyERC721.totalSupply();
        uint256 token_id_counter = lilyERC721.tokenIdCounter();
        assertEq(totalSupply, 1);
        assertEq(token_id_counter, 1);

        vm.prank(address(lilyERC721));
        vm.expectRevert(
            abi.encodeWithSelector(ILilyERC721.NotApprovedOrOwner.selector)
        );
        lilyERC721.burn(1);
    }

    // function test_burn_100Tokens() public {
    //     lilyERC721.setBurnEnabled(true);
    //     lilyERC721.setPublicMintEnabled(true);
    //     for (uint256 i; i < 100; i++) {
    //         lilyERC721.mint();
    //     }

    //     uint256 totalSupply = lilyERC721.totalSupply();
    //     uint256 token_id_counter = lilyERC721.tokenIdCounter();
    //     assertEq(totalSupply, 100);
    //     assertEq(token_id_counter, 100);

    //     for (uint256 i; i < 100; i++) {
    //         lilyERC721.burn(i + 1);
    //     }

    //     token_id_counter = lilyERC721.tokenIdCounter();
    //     totalSupply = lilyERC721.totalSupply();
    //     assertEq(totalSupply, 0);
    //     assertEq(token_id_counter, 100);
    // }

    //#endregion

    //#region balanceOf

    function test_balanceOf() public {
        lilyERC721.setPublicMintEnabled(true);
        lilyERC721.mint();
        uint256 balance = lilyERC721.balanceOf(address(this));
        assertEq(balance, 1);
    }

    function test_balanceOf_afterTransfer() public {
        lilyERC721.setPublicMintEnabled(true);
        lilyERC721.mint();
        lilyERC721.safeTransferFrom(address(this), w_main, 1);
        uint256 balance = lilyERC721.balanceOf(address(this));
        assertEq(balance, 0);
    }

    //#endregion

    //#region delegate calls

    function test_delegateCall() public {
        (bool success, bytes memory result) = address(lilyERC721)
            .delegatecall(abi.encodeWithSignature("burnEnabled()"));
        require(success, "Delegate call failed");
        bool myResult = abi.decode(result, (bool));
        console.log("myResult %s", myResult);
    }

    //#endregion
    //#region safeTransferFrom

    function test_safeTransferFrom() public {
        lilyERC721.setPublicMintEnabled(true);
        lilyERC721.mint();
        lilyERC721.safeTransferFrom(address(this), w_main, 1);
        uint256 balance = lilyERC721.balanceOf(w_main);
        assertEq(balance, 1);
    }

    function test_safeTransferFrom_MintOneThensafeTransferFrom_CircuitTest()
        public
    {
        lilyERC721.setPublicMintEnabled(true);
        lilyERC721.mint();
        lilyERC721.safeTransferFrom(address(this), w_main, 1);

        // Should not transfer
        vm.expectRevert("ERC721: caller is not token owner or approved");
        lilyERC721.safeTransferFrom(address(this), w_main, 1);

        // Should not transfer as token was already
        vm.expectRevert("ERC721: caller is not token owner or approved");
        lilyERC721.safeTransferFrom(address(this), w_main, 1);

        // Connect as a non-owner, should not be able to transfer
        vm.prank(address(0x1));
        vm.expectRevert("ERC721: caller is not token owner or approved");
        lilyERC721.safeTransferFrom(w_main, address(this), 1);
    }

    function test_safeTransferFrom_asApprovedOrOwner() public {
        lilyERC721.setPublicMintEnabled(true);
        lilyERC721.mint();
        lilyERC721.approve(w_main, 1);
        lilyERC721.safeTransferFrom(address(this), w_main, 1);
        uint256 balance = lilyERC721.balanceOf(w_main);
        assertEq(balance, 1);
    }

    function test_safeTransferFrom_asApprovedOrOwnerForNonApprovedToken()
        public
    {
        lilyERC721.setPublicMintEnabled(true);
        lilyERC721.mint();
        lilyERC721.mint();
        lilyERC721.approve(w_main, 1);
        vm.prank(w_main);
        vm.expectRevert("ERC721: caller is not token owner or approved");
        lilyERC721.safeTransferFrom(address(this), w_main, 2);
    }

    //#endregion
}
