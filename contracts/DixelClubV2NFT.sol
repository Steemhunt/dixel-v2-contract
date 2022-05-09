// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "base64-sol/base64.sol";
import "./lib/ERC721Enumerable.sol";
import "./lib/ColorUtils.sol";
import "./DixelClubV2Factory.sol";
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
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;
    DixelClubV2Factory private _factory;

    bool private _initialized;

    uint8[TOTAL_PIXEL_COUNT] public pixels; // 8 * 576 = 4608bit = 18 of 256bit storage block
    Shared.MetaData public metaData; // Collection meta data

    struct EditionData {
        uint24[PALETTE_SIZE] palette; // 24bit color (16,777,216) - up to 16 colors
    }
    EditionData[] private _editionData; // Color (palette) data for each edition

    mapping(address => uint24) whitelist; // users -> max minting count

    event Mint(address indexed to, uint256 indexed tokenId);

    function init(
        address owner_,
        string memory name_,
        string memory symbol_,
        Shared.MetaData memory metaData_,
        uint24[PALETTE_SIZE] memory palette_,
        uint8[TOTAL_PIXEL_COUNT] memory pixels_
    ) external {
        require(_initialized == false, "CONTRACT_ALREADY_INITIALIZED");
        _initialized = true;

        _factory = DixelClubV2Factory(msg.sender);

        // ERC721 attributes
        _name = name_;
        _symbol = symbol_;

        // Custom attributes
        metaData = metaData_;
        pixels = pixels_;

        // Transfer ownership to the collection creator, so he/she can edit info on marketplaces like Opeansea
        _transferOwnership(owner_);

        // Mint edition #0 to the creator with the default palette set automatically
        _mintNewEdition(owner_, palette_);
    }

    receive() external payable {}

    function mint(address to, uint24[PALETTE_SIZE] memory palette) public payable {
        uint256 mintingCost = metaData.mintingCost;

        require(msg.value == mintingCost, "INVALID_MINTING_COST_SENT");

        if (mintingCost > 0) {
            // Send fee to the beneficiary
            uint256 fee = mintingCost * _factory.mintingFee() / FRICTION_BASE;
            (bool sent, ) = (_factory.beneficiary()).call{ value: fee }("");
            require(sent, "FEE_TRANSFER_FAILED");

            // Send the rest of minting cost to the collection creator
            (bool sent2, ) = (owner()).call{ value: mintingCost - fee }("");
            require(sent2, "MINTING_COST_TRANSFER_FAILED");
        }

        _mintNewEdition(to, palette);
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


    // function getPixelsFor(uint256 tokenId) public view returns (uint24[CANVAS_SIZE][CANVAS_SIZE] memory) {
    //     return history[tokenId].pixels;
    // }

    function generateSVG(uint256 tokenId) external view returns (string memory) {
        return _generateSVG(_editionData[tokenId].palette, pixels);
    }

    // function generateBase64SVG(uint256 tokenId) public view returns (string memory) {
    //     return _generateBase64SVG(getPixelsFor(tokenId));
    // }

    // function generateJSON(uint256 tokenId) public view returns (string memory json) {
    //     // NOTE: We don't check token existence here,
    //     // so burnt tokens can also outputs this result unlike tokenURI function

    //     require(tokenId < _tokenIdTracker.current(), "TOKEN_NOT_MINTED");

    //     /* solhint-disable quotes */
    //     json = string(abi.encodePacked(
    //         '{"name":"Dixel Collection #',
    //         ColorUtils.uint2str(tokenId),
    //         '","description":"Dixel Club (https://dixel.club) is a draw to earn pixel art NFT platform where users can overwrite price-compounded pixels to generate fully on-chain NFTs.',
    //         '","updated_pixel_count":"',
    //         ColorUtils.uint2str(history[tokenId].updatedPixelCount),
    //         '","reserve_for_refund":"',
    //         ColorUtils.uint2str(history[tokenId].reserveForRefund),
    //         '","burned":',
    //         (history[tokenId].burned ? 'true' : 'false'),
    //         ',"image":"',
    //         generateBase64SVG(tokenId),
    //         '"}'
    //     ));
    //     /* solhint-enable quotes */
    // }

    // function tokenURI(uint256 tokenId) public view override returns (string memory) {
    //     require(_exists(tokenId), "TOKEN_NOT_MINTED_OR_BURNED");

    //     return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(generateJSON(tokenId)))));
    // }

    // function burn(uint256 tokenId) external {
    //     address msgSender = _msgSender();

    //     // Check if token has already been burned, distinguishing it from revert due to non existing tokenId
    //     require(history[tokenId].burned != true, "TOKEN_HAS_ALREADY_BURNED");

    //     // This will also check `_exists(tokenId)`
    //     require(_isApprovedOrOwner(msgSender, tokenId), "CALLER_IS_NOT_APPROVED");

    //     _burn(tokenId);

    //     // Refund reserve amount
    //     history[tokenId].burned = true;
    //     require(baseToken.transfer(msgSender, history[tokenId].reserveForRefund), "REFUND_TRANSFER_FAILED");

    //     emit Burn(msgSender, tokenId, history[tokenId].reserveForRefund);
    // }

    // MARK: - External utility functions

    function nextTokenId() external view returns (uint256) {
        return _tokenIdTracker.current();
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function collectionMetaData() external view returns (
        string memory name_,
        string memory symbol_,
        bool whitelistOnly,
        uint24 maxSupply,
        uint24 royaltyFriction,
        uint40 mintingBeginsFrom,
        uint256 mintingCost,
        string memory description,
        uint256 totalSupply_,
        uint8[TOTAL_PIXEL_COUNT] memory pixels_
    ) {
        name_ = name();
        symbol_ = symbol();
        whitelistOnly = metaData.whitelistOnly;
        maxSupply = metaData.maxSupply;
        royaltyFriction = metaData.royaltyFriction;
        mintingBeginsFrom = metaData.mintingBeginsFrom;
        mintingCost = metaData.mintingCost;
        description = metaData.description;
        totalSupply_ = totalSupply();
        pixels_ = pixels;
    }

    function paletteOf(uint256 tokenId) external view returns (uint24[PALETTE_SIZE] memory) {
        return _editionData[tokenId].palette;
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

        return (owner(), (_salePrice * metaData.royaltyFriction) / FRICTION_BASE);
    }
}
