// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "../lib/ColorUtils.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol"; // Fot test

contract ColorUtilsMock {
    function uint2str(uint256 i) external pure returns (string memory) {
        return ColorUtils.uint2str(i);
    }

    function uint2hex(uint24 i) external pure returns (string memory) {
        return ColorUtils.uint2hex(i);
    }
}
