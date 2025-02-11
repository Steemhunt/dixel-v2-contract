// SPDX-License-Identifier: BSD-3-Clause

pragma solidity =0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./lib/StringUtils.sol";
import "./Constants.sol";
import "./Shared.sol";
import "./IDixelClubV2NFT.sol";

contract DixelClubV2Factory is Constants, Ownable {
    error DixelClubV2Factory__BlankedName();
    error DixelClubV2Factory__BlankedSymbol();
    error DixelClubV2Factory__DescriptionTooLong();
    error DixelClubV2Factory__InvalidMaxSupply();
    error DixelClubV2Factory__InvalidRoyalty();
    error DixelClubV2Factory__InvalidCreationFee();
    error DixelClubV2Factory__ZeroAddress();
    error DixelClubV2Factory__InvalidFee();
    error DixelClubV2Factory__CloneCreationFailed();

    /**
     *  EIP-1167: Minimal Proxy Contract - ERC721 Token implementation contract
     *  REF: https://github.com/optionality/clone-factory
     */
    address public nftImplementation;

    address public beneficiary = address(0xda5f7fd4C6e0e79e515759a587EE7e8EFeC6d280);
    uint256 public creationFee = 0.000111 ether; // to be updated for each chain
    uint256 public flatFee = 0.000111 ether; // to be updated for each chain
    uint256 public mintingFee = 500; // 5% from creator for paid minting

    // Array of all created nft collections
    address[] public collections;

    event CollectionCreated(address indexed nftAddress, string name, string symbol);

    constructor(address DixelClubV2NFTImpl) {
        nftImplementation = DixelClubV2NFTImpl;
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
        string calldata name,
        string calldata symbol,
        string calldata description,
        Shared.MetaData memory metaData,
        uint24[PALETTE_SIZE] calldata palette,
        uint8[PIXEL_ARRAY_SIZE] calldata pixels
    ) external payable returns (address) {
        if (msg.value != creationFee) revert DixelClubV2Factory__InvalidCreationFee();
        if (bytes(name).length == 0) revert DixelClubV2Factory__BlankedName();
        if (bytes(symbol).length == 0) revert DixelClubV2Factory__BlankedSymbol();
        if (bytes(description).length > 1000) revert DixelClubV2Factory__DescriptionTooLong(); // ~900 gas per character
        if (metaData.maxSupply == 0 || metaData.maxSupply > MAX_SUPPLY) revert DixelClubV2Factory__InvalidMaxSupply();
        if (metaData.royaltyFriction > MAX_ROYALTY_FRACTION) revert DixelClubV2Factory__InvalidRoyalty();

        // Neutralize minting starts date
        if (metaData.mintingBeginsFrom < block.timestamp) {
            metaData.mintingBeginsFrom = uint40(block.timestamp);
        }

        if (creationFee > 0) {
            // Send fee to the beneficiary
            (bool sent, ) = beneficiary.call{value: creationFee}("");
            require(sent, "CREATION_FEE_TRANSFER_FAILED");
        }

        address nftAddress = _createClone(nftImplementation);
        if (nftAddress == address(0)) revert DixelClubV2Factory__CloneCreationFailed();

        IDixelClubV2NFT newNFT = IDixelClubV2NFT(nftAddress);
        newNFT.init(msg.sender, name, symbol, description, metaData, palette, pixels);

        collections.push(nftAddress);

        emit CollectionCreated(nftAddress, name, symbol);

        return nftAddress;
    }

    // MARK: - Admin functions

    // Admin functions to add a NFT to the collections manually for migration
    function addCollection(address nftAddress) external onlyOwner {
        collections.push(nftAddress);
    }

    // This will update NFT contract implementaion and it won't affect existing collections
    function updateImplementation(address newImplementation) external onlyOwner {
        nftImplementation = newImplementation;
    }

    function updateBeneficiary(address newAddress) external onlyOwner {
        if (newAddress == address(0)) revert DixelClubV2Factory__ZeroAddress();
        beneficiary = newAddress;
    }

    function updateMintingFee(uint256 newMintingFee) external onlyOwner {
        if (newMintingFee > FRICTION_BASE) revert DixelClubV2Factory__InvalidFee();
        mintingFee = newMintingFee;
    }

    function updateFlatFee(uint256 newFlatFee) external onlyOwner {
        flatFee = newFlatFee;
    }

    function updateCreationFee(uint256 newCreationFee) external onlyOwner {
        creationFee = newCreationFee;
    }

    // MARK: - Utility functions

    function collectionCount() external view returns (uint256) {
        return collections.length;
    }

    function getCollections(uint256 offset, uint256 limit) external view returns (address[] memory list) {
        unchecked {
            address[] memory clone = collections; // gas saving
            uint256 length = clone.length; // gas saving
            uint256 count = limit;

            if (offset >= length) {
                return list; // empty list
            } else if (offset + limit > length) {
                count = length - offset;
            }

            list = new address[](count);
            for (uint256 i = 0; i != count; ++i) {
                list[i] = clone[offset + i];
            }
        }
    }
}
