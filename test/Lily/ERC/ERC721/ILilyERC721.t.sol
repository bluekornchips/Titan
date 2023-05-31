// SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import {ILilyERC721, LilyERC721} from "Lily/ERC/ERC721/LilyERC721.sol";

import {LilyERC721TestHelpers} from "test-helpers//LilyERC721TestHelpers.sol";
import {Titan} from "test-helpers/Titan/Titan.sol";

contract ILilyERC721_Test is LilyERC721TestHelpers, ILilyERC721, Titan {}
