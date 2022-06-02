// SPDX-License-Identifier: BSD-3-Clause

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
    struct EditionData {
        uint24[PALETTE_SIZE] palette; // 24bit color (16,777,216) - up to 16 colors
    }

    IDixelClubV2Factory private _factory;
    uint32 private _initializedAt;
    uint256 private _tokenIdTracker;
    Shared.MetaData private _metaData; // Collection meta data
    EditionData[] private _editionData; // Color (palette) data for each edition
    uint8[TOTAL_PIXEL_COUNT] private _pixels; // 8 * 576 = 4608bit = 18 of 256bit storage block
    address[] private _whitelist;

    event Mint(address indexed to, uint256 indexed tokenId);

    receive() external payable {}

    modifier checkTokenExists(uint256 tokenId) {
        require(_exists(tokenId), "NONEXISTENT_TOKEN");
        _;
    }

    function init(
        address owner_,
        string calldata name_,
        string calldata symbol_,
        Shared.MetaData calldata metaData_,
        uint24[PALETTE_SIZE] calldata palette_,
        uint8[TOTAL_PIXEL_COUNT] calldata pixels_
    ) external {
        require(_initializedAt == 0, "CONTRACT_ALREADY_INITIALIZED");
        _initializedAt = uint32(block.timestamp);

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

    function mint(address to, uint24[PALETTE_SIZE] calldata palette) public payable {
        uint256 mintingCost = _metaData.mintingCost;

        require(msg.value == mintingCost, "INVALID_MINTING_COST_SENT");
        require(_tokenIdTracker < _metaData.maxSupply, "MAX_SUPPLY_REACHED");
        require(uint32(block.timestamp) >= _metaData.mintingBeginsFrom, "MINTING_NOT_STARTED_YET");

        // For whitelist only collections
        if (_metaData.whitelistOnly) {
            require(isWhitelistWallet(msg.sender), "NOT_IN_WTHIELIST");

            _removeWhitelist(msg.sender); // decrease allowance by 1
        }

        if (mintingCost > 0) {
            // Send fee to the beneficiary
            uint256 fee = mintingCost * _factory.mintingFee() / FRICTION_BASE;
            payable(_factory.beneficiary()).transfer(fee);

            // Send the rest of minting cost to the collection creator
            payable(owner()).transfer(mintingCost - fee);
        }

        _mintNewEdition(to, palette);
    }

    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "CALLER_IS_NOT_APPROVED"); // This will check existence of token

        delete _editionData[tokenId];
        _burn(tokenId);
    }

    function _mintNewEdition(address to, uint24[PALETTE_SIZE] calldata palette) private {
        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        uint256 tokenId;
        unchecked {
            tokenId = _tokenIdTracker++;
        }
            
        _safeMint(to, tokenId);

        _editionData.push(EditionData(palette));
        unchecked {
            assert(tokenId == _editionData.length - 1);
        }

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
    function addWhitelist(address[] calldata list) external onlyOwner {
        require(_metaData.whitelistOnly, "COLLECTION_IS_PUBLIC");

        uint256 length = list.length; // gas saving
        for (uint256 i; i < length; ) {
            _whitelist.push(list[i]);
            unchecked {
                ++i;
            }
        }
    }

    function _removeWhitelist(address wallet) private {
        uint256 length = _whitelist.length;
        for (uint256 i; i != length;) {
            if (_whitelist[i] == wallet) {
                _whitelist[i] = _whitelist[_whitelist.length - 1]; // put the last element into the delete index
                _whitelist.pop(); // delete the last element to decrease array length;

                break; // delete the first matching one and stop
            }
            unchecked {
                ++i;
            }
        }
    }

    // @dev Maximum length of list array can be limited by block gas limit of blockchain
    function removeWhitelist(address[] calldata list) external onlyOwner {
        require(_metaData.whitelistOnly, "COLLECTION_IS_PUBLIC");

        uint256 length = list.length; // gas saving
        for (uint256 i; i < length;) {
            _removeWhitelist(list[i]);
            unchecked {
                ++i;
            }
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
        for (uint256 i = 0; i != count;) {
            list[i] = _whitelist[offset + i];
            unchecked {
                ++i;
            }
        }
    }

    function getWhitelistCount() external view returns (uint256) {
        return _whitelist.length;
    }

    function getWhitelistAllowanceLeft(address wallet) external view returns (uint256 allowance) {
        uint256 length = _whitelist.length; // gas saving
        for (uint256 i; i != length; ) {
            if (_whitelist[i] == wallet) {
                allowance++;
            }
            unchecked {
                ++i;
            }
        }

        return allowance;
    }

    function isWhitelistWallet(address wallet) public view returns (bool) {
        uint256 length = _whitelist.length; // gas saving
        for (uint256 i; i != length; ) {
            if (_whitelist[i] == wallet) {
                return true;
            }
            unchecked {
                ++i;
            }
        }

        return false;
    }


    // MARK: - Update metadata

    function updateMetadata(bool whitelistOnly, bool hidden, uint24 royaltyFriction, uint32 mintingBeginsFrom, uint256 mintingCost) external onlyOwner {
        require(royaltyFriction <= MAX_ROYALTY_FRACTION, "INVALID_ROYALTY_FRICTION");
        require((_metaData.mintingBeginsFrom == mintingBeginsFrom || uint32(block.timestamp) < _metaData.mintingBeginsFrom), "CANNOT_UPDATE_MITING_TIME_ONCE_STARTED");

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
        return _tokenIdTracker;
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function listData() external view returns (uint32 initializedAt_, bool hidden_) {
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
