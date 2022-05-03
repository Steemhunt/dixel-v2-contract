// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

library Shared {
    struct MetaData {
        bool whitelistOnly;
        uint24 maxSupply; // can be minted up to MAX_SUPPLY
        uint24 royaltyFriction; // used for `royaltyInfo` (ERC2981) and `seller_fee_basis_points` (Opeansea's Contract-level metadata)
        uint40 mintingBeginsFrom; // Timestamp that minting event begins
        uint256 mintingCost; // Native token (ETH, BNB, KLAY, etc)
        string description;
    }
}
