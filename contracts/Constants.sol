// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

/**
* @title DixelClubV2 contstans
*/
contract Constants {
    uint16 internal constant MAX_ROYALTY_FRACTION = 1000; // 10%
    uint24 internal constant MAX_SUPPLY = 1000000; // 1M hardcap max
    uint80 internal constant MAX_MINTING_COST = 100000 * 1e18; // 100K DIXEL tokens

    uint8 internal constant PALETTE_SIZE = 16; // 16 colors max
    uint8 internal constant CANVAS_SIZE = 24; // 24x24 pixels
}