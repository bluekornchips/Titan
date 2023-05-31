// SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import {ILilyERC20, LilyERC20} from "Lily/ERC/ERC20/LilyERC20.sol";
import {ILilyERC20Airdrop} from "Lily/ERC/ERC20/utils/ILilyERC20Airdrop.sol";

import {Titan} from "test-helpers/Titan/Titan.sol";

import {LilyERC20TestHelpers} from "test-helpers/LilyERC20TestHelpers.sol";

abstract contract ILilyERC20Airdrop_Test is
    ILilyERC20,
    ILilyERC20Airdrop,
    LilyERC20TestHelpers,
    Titan
{}
