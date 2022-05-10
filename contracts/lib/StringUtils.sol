// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

library StringUtils {
    function contains(string memory haystack, bytes1 needle) internal pure returns (bool) {
        bytes memory haystackBytes = bytes(haystack);
        for (uint256 i = 0; i < haystackBytes.length; i++) {
            if (haystackBytes[i] == needle) {
                return true;
            }
        }

        return false;
    }
}