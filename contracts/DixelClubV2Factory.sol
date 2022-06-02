// SPDX-License-Identifier: BSD-3-Clause

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./lib/StringUtils.sol";
import "./Constants.sol";
import "./Shared.sol";
import "./DixelClubV2NFT.sol";

/**
* @title Dixel Club (V2) NFT Factory
*
* Create an ERC721 Dixel Club NFTs using proxy pattern to save gas
*/
contract DixelClubV2Factory is Constants, Ownable {
    /**
     *  EIP-1167: Minimal Proxy Contract - ERC721 Token implementation contract
     *  REF: https://github.com/optionality/clone-factory
     */
    address public nftImplementation;

    address payable public beneficiary = payable(0x82CA6d313BffE56E9096b16633dfD414148D66b1);
    uint256 public creationFee = 0.02 ether; // 0.02 ETH (~$50)
    uint256 public mintingFee = 500; // 5%;

    // Array of all created nft collections
    address[] public collections;

    event CollectionCreated(address indexed nftAddress, string name, string symbol);

    constructor() {
        nftImplementation = address(new DixelClubV2NFT());
    }

    function _createClone(address target) private returns (address payable result) {
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
        string calldata name,
        string calldata symbol,
        Shared.MetaData calldata metaData,
        uint24[PALETTE_SIZE] calldata palette,
        uint8[TOTAL_PIXEL_COUNT] calldata pixels
    ) external payable returns (address payable) {
        require(bytes(name).length > 0, "NAME_CANNOT_BE_BLANK");
        require(bytes(symbol).length > 0, "SYMBOL_CANNOT_BE_BLANK");
        require(bytes(metaData.description).length <= 1000, "DESCRIPTION_TOO_LONG"); // ~900 gas per character
        require(metaData.maxSupply > 0 && metaData.maxSupply <= MAX_SUPPLY, "INVALID_MAX_SUPPLY");
        require(metaData.royaltyFriction <= MAX_ROYALTY_FRACTION, "INVALID_ROYALTY_FRICTION");

        // Validate `symbol`, `name` and `description` to ensure generateJSON() creates a valid JSON
        require(!StringUtils.contains(name, 0x22), "NAME_CONTAINS_MALICIOUS_CHARACTER");
        require(!StringUtils.contains(symbol, 0x22), "SYMBOL_CONTAINS_MALICIOUS_CHARACTER");
        require(!StringUtils.contains(metaData.description, 0x22), "DESCRIPTION_CONTAINS_MALICIOUS_CHARACTER");

        if (creationFee > 0) {
            require(msg.value == creationFee, "INVALID_CREATION_FEE_SENT");

            // Send fee to the beneficiary
            beneficiary.transfer(creationFee);
        }

        address payable nftAddress = _createClone(nftImplementation);
        DixelClubV2NFT newNFT = DixelClubV2NFT(nftAddress);
        newNFT.init(msg.sender, name, symbol, metaData, palette, pixels);

        collections.push(nftAddress);

        emit CollectionCreated(nftAddress, name, symbol);

        return nftAddress;
    }

    // MARK: Admin functions

    // This will update NFT contract implementaion and it won't affect existing collections
    function updateImplementation(address newImplementation) external onlyOwner {
        nftImplementation = newImplementation;
    }

    function updateBeneficiary(address payable newAddress, uint256 newCreationFee, uint256 newMintingFee) external onlyOwner {
        require(newAddress != address(0), "BENEFICIARY_CANNOT_BE_NULL");
        require(newMintingFee <= FRICTION_BASE, "INVALID_FEE_FRICTION");

        beneficiary = newAddress;
        mintingFee = newMintingFee;
        creationFee = newCreationFee;
    }

    // MARK: - Utility functions

    function collectionCount() external view returns (uint256) {
        return collections.length;
    }
}
