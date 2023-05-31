// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract LilyERC721TestHelpers {
    string public constant NAME = "LilyERC721";
    string public constant SYMBOL = "CERC721";
    uint32 public constant MAX_SUPPLY = 10_000;
    string public constant BASE_URI = "https://lily.com/";

    receive() external payable {}

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
