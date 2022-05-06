// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

abstract contract Constants {
    uint256 public constant MAX_SUPPLY = 1000000; // 1M hardcap max
    uint256 public constant MAX_ROYALTY_FRACTION = 1000; // 10%
    uint256 public constant FRICTION_BASE = 10000;

    uint256 internal constant PALETTE_SIZE = 16; // 16 colors max - equal to the data type max value of CANVAS_SIZE (2^8 = 16)
    uint256 internal constant CANVAS_SIZE = 24; // 24x24 pixels
    uint256 internal constant TOTAL_PIXEL_COUNT = 576; // 24x24
}
