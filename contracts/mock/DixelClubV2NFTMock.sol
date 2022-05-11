// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "../DixelClubV2NFT.sol";

contract DixelClubV2NFTMock is DixelClubV2NFT {
    function version() external pure override returns (uint16) {
        return 2;
    }
}
