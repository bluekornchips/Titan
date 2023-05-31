// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {ILilyERC20} from "Lily/ERC/ERC20/ILilyERC20.sol";
import {ILilyERC20Airdrop} from "Lily/ERC/ERC20/utils/ILilyERC20Airdrop.sol";

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract LilyERC20Airdrop is ILilyERC20Airdrop {
    /// @dev A counter for tracking the token ID
    uint16 public airDropCounter;

    /// @dev Limit size to prevent overflow. Uint256 used to prevent overflow if greater than length is    passed in during runtime.
    uint256 public constant MAX_DROPS = type(uint16).max;

    /**
     * @dev             Deliver airdrops to an array of addresses.
     * @param token     The address of the token contract.
     * @param airdrops  An array of ERC20Package structs.
     */
    function airdrop(IERC20 token, ERC20Package[] calldata airdrops) external {
        if (airdrops.length < 1 || airdrops.length > MAX_DROPS) {
            revert AirdropLengthInvalid();
        }

        uint16 airdropCount = uint16(airdrops.length);
        uint256 total;
        uint16 index;

        unchecked {
            do {
                if (airdrops[index].value == 0) {
                    revert ZeroBalanceTransfer();
                }
                total += airdrops[index].value;
                ++index;
            } while (index < airdropCount);
        }

        token.transferFrom(msg.sender, address(this), total); // Will revert if not enough tokens

        index = 0;

        unchecked {
            do {
                if (
                    !token.transfer(
                        airdrops[index].recipient,
                        airdrops[index].value
                    )
                ) {
                    revert TransferFailed();
                }
                ++index;
            } while (index < airdropCount);
        }
        ++airDropCounter;
        emit AirdropDelivered(airDropCounter, airdrops);
    }
}
