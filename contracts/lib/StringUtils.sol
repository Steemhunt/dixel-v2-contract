// SPDX-License-Identifier: BSD-3-Clause

import "@openzeppelin/contracts/utils/Strings.sol";

pragma solidity ^0.8.13;

library StringUtils {
    function contains(string memory haystack, bytes1 needle) internal pure returns (bool) {
        bytes memory haystackBytes = bytes(haystack);
        uint256 length = haystackBytes.length;
        for (uint256 i; i != length; ) {
            if (haystackBytes[i] == needle) {
                return true;
            }
            unchecked {
                ++i;
            }
        }

        return false;
    }

    function address2str(address addr) internal pure returns (string memory) {
        return Strings.toHexString(uint160(addr), 20);
    }
}