// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

abstract contract Constants {
    uint24 public constant MAX_SUPPLY = 1000000; // 1M hardcap max
    uint16 public constant MAX_ROYALTY_FRACTION = 10000; // 10%

    uint8 public constant PALETTE_SIZE = 16; // 16 colors max
    uint8 public constant CANVAS_SIZE = 24; // 24x24 pixels
    uint16 public constant TOTAL_PIXEL_COUNT = 576; // 24x24
}
