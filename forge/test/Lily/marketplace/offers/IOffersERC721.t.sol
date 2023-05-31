// SPDX-License-Identifier: None
pragma solidity ^0.8.19;

import {Titan} from "test-helpers/Titan/Titan.sol";
import {LilyERC721TestHelpers} from "test-helpers//LilyERC721TestHelpers.sol";
import {IOffersERC721} from "Lily/marketplace/offers/OffersERC721.sol";

abstract contract IOffersERC721_Test is
    LilyERC721TestHelpers,
    Titan,
    IOffersERC721
{}
