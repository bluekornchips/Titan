// SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import {Titan} from "test-helpers/Titan/Titan.sol";
import {LilyERC721TestHelpers} from "test-helpers//LilyERC721TestHelpers.sol";
import {IEscrowERC721} from "Lily/marketplace/escrow/IEscrowERC721.sol";

abstract contract IEscrowERC721_Test is
    LilyERC721TestHelpers,
    IEscrowERC721,
    Titan
{}
