// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";

import {LilyERC721StorageURI} from "Lily/ERC/ERC721/extensions/LilyERC721StorageURI.sol";

import {LilyERC721TestHelpers} from "test-helpers//LilyERC721TestHelpers.sol";
import {Titan} from "test-helpers/Titan/Titan.sol";

contract LilyERC721StorageURI_Test is Test, LilyERC721TestHelpers, Titan {
    LilyERC721StorageURI public lilyERC721StorageURI;

    function setUp() public {
        lilyERC721StorageURI = new LilyERC721StorageURI(
            NAME,
            SYMBOL,
            MAX_SUPPLY,
            BASE_URI
        );
    }

    function test_setTokenURI() public {
        uint32 tokenId = 1;
        string memory tokenURI = "https://browncows.com/chocolate";

        // Clear the BaseURI
        lilyERC721StorageURI.setBaseURI("");
        lilyERC721StorageURI.setPublicMintEnabled(true);
        lilyERC721StorageURI.mint();
        lilyERC721StorageURI.setTokenURI(tokenId, tokenURI);

        assertEq(
            lilyERC721StorageURI.tokenURI(tokenId),
            tokenURI,
            "tokenURI should be set"
        );

        // Mint another token to test that the tokenURI is not set for the new token
        lilyERC721StorageURI.mint();
        tokenId++;
        assertEq(
            lilyERC721StorageURI.tokenURI(tokenId),
            "",
            "tokenURI should be set"
        );
    }
}
