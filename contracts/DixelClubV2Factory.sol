// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./Constants.sol";
import "./Shared.sol";
import "./DixelClubV2NFT.sol";

/**
* @title Dixel Club (V2) NFT Factory
*
* Create an ERC721 Dixel Club NFTs using proxy pattern to save gas
*/
contract DixelClubV2Factory is Constants {
    /**
     *  EIP-1167: Minimal Proxy Contract - ERC721 Token implementation contract
     *  REF: https://github.com/optionality/clone-factory
     */
    address public nftImplementation;

    // Array of all created nft collections
    address[] public collections;

    event CollectionCreated(address indexed nftAddress, string name, string symbol);

    constructor() {
        nftImplementation = address(new DixelClubV2NFT());
    }

    function _createClone(address target) private returns (address result) {
        bytes20 targetBytes = bytes20(target);
        assembly {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), targetBytes)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            result := create(0, clone, 0x37)
        }
    }

    function createCollection(
        string memory name,
        string memory symbol,
        Shared.MetaData memory metaData,
        uint24[PALETTE_SIZE] memory palette,
        uint8[TOTAL_PIXEL_COUNT] memory pixels
    ) external returns (address) {
        require(bytes(name).length > 0, 'NAME_CANNOT_BE_BLANK');
        require(bytes(symbol).length > 0, 'SYMBOL_CANNOT_BE_BLANK');
        require(bytes(metaData.description).length > 0, 'DESCRIPTION_CANNOT_BE_BLANK');
        require(metaData.maxSupply > 0 && metaData.maxSupply <= MAX_SUPPLY, 'INVALID_MAX_SUPPLY');
        require(metaData.royaltyFriction <= MAX_ROYALTY_FRACTION, 'INVALID_ROYALTY_FRICTION');

        // TODO: check if palette contains 0 -> if so, it should be on index 0 to save gas

        address nftAddress = _createClone(nftImplementation);
        DixelClubV2NFT newNFT = DixelClubV2NFT(nftAddress);
        newNFT.init(msg.sender, name, symbol, metaData, palette, pixels);

        collections.push(nftAddress);

        emit CollectionCreated(nftAddress, name, symbol);

        return nftAddress;
    }

    function collectionCount() external view returns (uint256) {
        return collections.length;
    }
}
