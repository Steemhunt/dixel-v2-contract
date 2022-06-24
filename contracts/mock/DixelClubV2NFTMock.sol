// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "../DixelClubV2NFT.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

contract DixelClubV2NFTMock is DixelClubV2NFT {
    function version() external pure override returns (uint16) {
        return 3;
    }

    // MARK: - Using a simple array
    // add: O(1) / remove: O(n) / space: O(n)

    address[] private _whitelist1;
    function addWhitelist_SimpleArray(address[] calldata list) external onlyOwner {
        for (uint256 i; i < list.length; i++) {
            _whitelist1.push(list[i]);
        }
    }
    function _removeWhitelist_SimpleArray(address wallet) private {
        for (uint256 i; i < _whitelist1.length; i++) {
            if (_whitelist1[i] == wallet) {
                _whitelist1[i] = _whitelist1[_whitelist1.length - 1]; // put the last element into the delete index
                _whitelist1.pop(); // delete the last element to decrease array length;

                break; // delete the first matching one and stop
            }
        }
    }
    function removeWhitelist_SimpleArray(address[] calldata list) external onlyOwner {
        for (uint256 i; i < list.length; i++) {
            _removeWhitelist_SimpleArray(list[i]);
        }
    }
    function getWhitelistCount_SimpleArray() external view returns (uint256) {
        return _whitelist1.length;
    }

    // MARK: - Using EnumerableMap
    // add: O(1) / remove: O(1) / space: O(2n)

    using EnumerableMap for EnumerableMap.AddressToUintMap;
    EnumerableMap.AddressToUintMap private _whitelist2;

    function addWhitelist_EnumerableMap(address[] calldata list) external onlyOwner {
        for (uint256 i; i < list.length; i++) {
            _whitelist2.set(list[i], 1); // assume all list are unique to make the test simple
        }
    }
    function removeWhitelist_EnumerableMap(address[] calldata list) external onlyOwner {
        for (uint256 i; i < list.length; i++) {
            _whitelist2.set(list[i], 0);
        }
    }
    function getWhitelistCount_EnumerableMap() external view returns (uint256 count) {
        uint256 length = _whitelist2.length();
        for (uint256 i = 0; i < length; i++) {
            (, uint256 allowance) = _whitelist2.at(i);
            count += allowance;
        }
    }

    // MARK: - Using a custom EnumerableMapping implemented by @Nipol
    // Ref: https://github.com/Nipol/dixel-v2-contract/blob/bean/optimization/contracts/DixelClubV2NFT.sol
    // add: O(1) / remove: O(1) / space: O(2n)

    struct PositionCount {
        uint96 position;
        uint96 count;
        bool init;
        mapping(address => bool) hitted;
    }
    mapping(address => PositionCount) private _whitelistData3;
    address[] private _whitelist3;

    function addWhitelist_CustomMap(address[] calldata list) external onlyOwner {
        uint256 length = list.length;
        address curr;
        for (uint256 i; i != length; ) {
            curr = list[i];
            PositionCount storage pc = _whitelistData3[curr];

            if (!_whitelistData3[address(0)].hitted[curr]) {
                _whitelistData3[address(0)].hitted[curr] = true;
                _whitelist3.push(curr);
                unchecked {
                    (pc.position, pc.init) = (uint96(_whitelist3.length) - 1, true);
                }
            }

            unchecked {
                ++pc.count;
                ++i;
            }
        }

        delete _whitelistData3[address(0)];
    }
    function _removeWhitelist_CustomMap(address wallet) private {
        PositionCount storage pc = _whitelistData3[wallet];
        if (--pc.count == 0 && pc.init == true) {
            // FIXED from the original implementation: the position data should be also updated after swap
            address lastAddress = _whitelist3[_whitelist3.length - 1];
            _whitelistData3[lastAddress].position = pc.position;
            _whitelist3[pc.position] = lastAddress;

            _whitelist3.pop();
            delete _whitelistData3[wallet];
        }
    }
    function removeWhitelist_CustomMap(address[] calldata list) external onlyOwner {
        uint256 length = list.length;
        for (uint256 i; i != length;) {
            _removeWhitelist_CustomMap(list[i]);
            unchecked {
                ++i;
            }
        }
    }
    function getWhitelistCount_CustomMap() external view returns (uint256) {
        return _whitelist3.length;
    }


    // TODO: Merkle Tree
    // - How should we store the original address data on-chain?
}
