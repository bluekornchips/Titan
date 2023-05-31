// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";

import {LilyWrappedDirt} from "Lily/ERC/ERC20/LilyWrappedDirt.sol";

import {Titan} from "test-helpers/Titan/Titan.sol";

contract LilyWrappedDirt_Test is Test, Titan {
    LilyWrappedDirt lilyWrappedDirt;

    function setUp() public {
        lilyWrappedDirt = new LilyWrappedDirt("WrappedDirt", "WDIRT");
    }
}
