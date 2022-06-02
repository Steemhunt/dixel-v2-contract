// SPDX-License-Identifier: BSD-3-Clause

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "base64-sol/base64.sol";
import "./lib/ERC721Enumerable.sol";
import "./lib/ColorUtils.sol";
import "./lib/StringUtils.sol";
import "./IDixelClubV2Factory.sol";
import "./Shared.sol";
import "./SVGGenerator.sol"; // inheriting Constants

/**
 * @dev DixelArt NFT token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - a owner (Dixel contract) that allows for token minting (creation)
 *  - token ID and URI autogeneration
 */
contract DixelClubV2NFT is ERC721Enumerable, Ownable, SVGGenerator {


    //For whitelisting
    bytes32 private _merkleRootHash;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;
    IDixelClubV2Factory private _factory;

    uint40 private _initializedAt;

    uint8[TOTAL_PIXEL_COUNT] private _pixels; // 8 * 576 = 4608bit = 18 of 256bit storage block
    Shared.MetaData private _metaData; // Collection meta data

    struct EditionData {
        uint24[PALETTE_SIZE] palette; // 24bit color (16,777,216) - up to 16 colors
    }
    EditionData[] private _editionData; // Color (palette) data for each edition

    address[] private _whitelist;

    event Mint(address indexed to, uint256 indexed tokenId);

    receive() external payable {}

    modifier checkTokenExists(uint256 tokenId) {
        require(_exists(tokenId), "NONEXISTENT_TOKEN");
        _;
    }

    function init(
        address owner_,
        string memory name_,
        string memory symbol_,
        Shared.MetaData memory metaData_,
        uint24[PALETTE_SIZE] memory palette_,
        uint8[TOTAL_PIXEL_COUNT] memory pixels_
    ) external {
        require(_initializedAt == 0, "CONTRACT_ALREADY_INITIALIZED");
        _initializedAt = uint40(block.timestamp);

        _factory = IDixelClubV2Factory(msg.sender);

        // ERC721 attributes
        _name = name_;
        _symbol = symbol_;

        // Custom attributes
        _metaData = metaData_;
        _pixels = pixels_;

        // Transfer ownership to the collection creator, so he/she can edit info on marketplaces like Opeansea
        _transferOwnership(owner_);

        // Mint edition #0 to the creator with the default palette set automatically
        _mintNewEdition(owner_, palette_);
    }

    function setRootHash(bytes32 rootHash) external onlyOwner {
        _merkleRootHash = rootHash;
    }

    function mint(address to, uint24[PALETTE_SIZE] memory palette, bytes32[] calldata _merkleProof) public payable {
        uint256 mintingCost = _metaData.mintingCost;

        require(msg.value == mintingCost, "INVALID_MINTING_COST_SENT");
        require(_tokenIdTracker.current() < _metaData.maxSupply, "MAX_SUPPLY_REACHED");
        require(block.timestamp >= _metaData.mintingBeginsFrom, "MINTING_NOT_STARTED_YET");

        // For whitelist only collections
        if (_metaData.whitelistOnly) {
            bytes32 leafHash = keccak256(abi.encodePacked(msg.sender));
            require(MerkleProof.verify(_merkleProof, _merkleRootHash, leafHash), "not in whilelist");
        }

        if (mintingCost > 0) {
            // Send fee to the beneficiary
            // Best to mutiple before you divide
            uint256 fee = (mintingCost * _factory.mintingFee()) / FRICTION_BASE;
            (bool sent, ) = (_factory.beneficiary()).call{ value: fee }("");
            require(sent, "FEE_TRANSFER_FAILED");

            // Send the rest of minting cost to the collection creator
            (bool sent2, ) = (owner()).call{ value: mintingCost - fee }("");
            require(sent2, "MINTING_COST_TRANSFER_FAILED");
        }

        _mintNewEdition(to, palette);
    }

    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "CALLER_IS_NOT_APPROVED"); // This will check existence of token

        delete _editionData[tokenId];
        _burn(tokenId);
    }

    function _mintNewEdition(address to, uint24[PALETTE_SIZE] memory palette) private {
        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        uint256 tokenId = _tokenIdTracker.current();
        _safeMint(to, tokenId);

        _editionData.push(EditionData(palette));
        assert(tokenId == _editionData.length - 1);

        _tokenIdTracker.increment();

        emit Mint(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override checkTokenExists(tokenId) returns (string memory) {
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(tokenJSON(tokenId)))));
    }

    // Contract-level metadata for Opeansea
    // REF: https://docs.opensea.io/docs/contract-level-metadata
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(contractJSON()))));
    }

    // MARK: - Whitelist related functions

    // @dev Maximum length of list array can be limited by block gas limit of blockchain
    // @notice Duplicated address input means multiple allowance
    function addWhitelist(address[] memory list) external onlyOwner {
        require(_metaData.whitelistOnly, "COLLECTION_IS_PUBLIC");

        uint256 length = list.length; // gas saving
        for (uint256 i = 0; i < length; i++) {
            _whitelist.push(list[i]);
        }
    }

    function _removeWhitelist(address wallet) private {
        for (uint256 i = 0; i < _whitelist.length; i++) {
            if (_whitelist[i] == wallet) {
                _whitelist[i] = _whitelist[_whitelist.length - 1]; // put the last element into the delete index
                _whitelist.pop(); // delete the last element to decrease array length;

                break; // delete the first matching one and stop
            }
        }
    }

    // @dev Maximum length of list array can be limited by block gas limit of blockchain
    function removeWhitelist(address[] memory list) external onlyOwner {
        require(_metaData.whitelistOnly, "COLLECTION_IS_PUBLIC");

        uint256 length = list.length; // gas saving
        for (uint256 i = 0; i < length; i++) {
            _removeWhitelist(list[i]);
        }
    }

    // @dev offset & limit for pagination
    function getAllWhitelist(uint256 offset, uint256 limit) external view returns (address[] memory list) {
        uint256 length = _whitelist.length;
        uint256 count = limit;

        if (offset >= length) {
            return list; // empty list
        } else if (offset + limit > length) {
            count = length - offset;
        }

        list = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            list[i] = _whitelist[offset + i];
        }
    }

    function getWhitelistCount() external view returns (uint256) {
        return _whitelist.length;
    }

    function getWhitelistAllowanceLeft(address wallet) external view returns (uint256 allowance) {
        uint256 length = _whitelist.length; // gas saving
        for (uint256 i = 0; i < length; i++) {
            if (_whitelist[i] == wallet) {
                allowance++;
            }
        }

        return allowance;
    }

    function isWhitelistWallet(address wallet) public view returns (bool) {
        uint256 length = _whitelist.length; // gas saving
        for (uint256 i = 0; i < length; i++) {
            if (_whitelist[i] == wallet) {
                return true;
            }
        }

        return false;
    }


    // MARK: - Update metadata

    function updateMetadata(bool whitelistOnly, bool hidden, uint24 royaltyFriction, uint40 mintingBeginsFrom, uint256 mintingCost) external onlyOwner {
        require(royaltyFriction <= MAX_ROYALTY_FRACTION, "INVALID_ROYALTY_FRICTION");
        require((_metaData.mintingBeginsFrom == mintingBeginsFrom || block.timestamp < _metaData.mintingBeginsFrom), "CANNOT_UPDATE_MITING_TIME_ONCE_STARTED");

        _metaData.whitelistOnly = whitelistOnly;
        if (!_metaData.whitelistOnly) {
            delete _whitelist; // empty whitelist array data if it becomes public
        }

        _metaData.hidden = hidden;
        _metaData.royaltyFriction = royaltyFriction;
        _metaData.mintingBeginsFrom = mintingBeginsFrom;
        _metaData.mintingCost = mintingCost;
    }

    function updateDescription(string memory description) external onlyOwner {
        require(bytes(description).length <= 1000, "DESCRIPTION_TOO_LONG"); // ~900 gas per character
        require(!StringUtils.contains(description, 0x22), "DESCRIPTION_CONTAINS_MALICIOUS_CHARACTER");

        _metaData.description = description;
    }

    // MARK: - External utility functions

    function generateSVG(uint256 tokenId) external view checkTokenExists(tokenId) returns (string memory) {
        return _generateSVG(_editionData[tokenId].palette, _pixels);
    }

    function generateBase64SVG(uint256 tokenId) public view checkTokenExists(tokenId) returns (string memory) {
        return _generateBase64SVG(_editionData[tokenId].palette, _pixels);
    }

    function tokenJSON(uint256 tokenId) public view checkTokenExists(tokenId) returns (string memory) {
        return string(abi.encodePacked(
            '{"name":"',
            _symbol, ' #', ColorUtils.uint2str(tokenId),
            '","description":"',
            _metaData.description,
            '","external_url":"https://dixel.club/collection/',
            ColorUtils.uint2str(block.chainid), '/', StringUtils.address2str(address(this)), '/', ColorUtils.uint2str(tokenId),
            '","image":"',
            generateBase64SVG(tokenId),
            '"}'
        ));
    }

    function contractJSON() public view returns (string memory) {
        return string(abi.encodePacked(
            '{"name":"',
            _name,
            '","description":"',
            _metaData.description,
            '","image":"',
            generateBase64SVG(0),
            '","external_link":"https://dixel.club/collection/',
            ColorUtils.uint2str(block.chainid), '/', StringUtils.address2str(address(this)),
            '","seller_fee_basis_points":"',
            ColorUtils.uint2str(_metaData.royaltyFriction),
            '","fee_recipient":"',
            StringUtils.address2str(owner()),
            '"}'
        ));
    }

    function nextTokenId() external view returns (uint256) {
        return _tokenIdTracker.current();
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function listData() external view returns (uint40 initializedAt_, bool hidden_) {
        initializedAt_ = _initializedAt;
        hidden_ = _metaData.hidden;
    }

    function metaData() external view returns (
        string memory name_,
        string memory symbol_,
        bool whitelistOnly_,
        uint24 maxSupply_,
        uint24 royaltyFriction_,
        uint40 mintingBeginsFrom_,
        uint256 mintingCost_,
        string memory description_,
        uint256 totalSupply_,
        address owner_,
        uint8[TOTAL_PIXEL_COUNT] memory pixels_,
        uint24[PALETTE_SIZE] memory defaultPalette_
    ) {
        name_ = name();
        symbol_ = symbol();
        whitelistOnly_ = _metaData.whitelistOnly;
        maxSupply_ = _metaData.maxSupply;
        royaltyFriction_ = _metaData.royaltyFriction;
        mintingBeginsFrom_ = _metaData.mintingBeginsFrom;
        mintingCost_ = _metaData.mintingCost;
        description_ = _metaData.description;
        totalSupply_ = totalSupply();
        owner_ = owner();
        pixels_ = _pixels;
        defaultPalette_ = _editionData[0].palette;
    }

    function paletteOf(uint256 tokenId) external view checkTokenExists(tokenId) returns (uint24[PALETTE_SIZE] memory) {
        return _editionData[tokenId].palette;
    }

    function getAllPixels() external view returns (uint8[TOTAL_PIXEL_COUNT] memory) {
        return _pixels;
    }

    // MARK: - Override extensions

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev IERC2981 implementation
     * - NOTE: ERC2981 royalty info may not be applied on some marketplaces
     * - NOTE: Opensea uses contract-level metadata: https://docs.opensea.io/docs/contract-level-metadata
     */
    function royaltyInfo(uint256 /*_tokenId*/, uint256 _salePrice) public view returns (address, uint256) {
        // NOTE:
        // 1. The same royalty friction for all tokens in the same collection
        // 2. Receiver is collection owner

        return (owner(), (_salePrice * _metaData.royaltyFriction) / FRICTION_BASE);
    }

    // NFT implementation version
    function version() external pure virtual returns (uint16) {
        return 1;
    }
}
