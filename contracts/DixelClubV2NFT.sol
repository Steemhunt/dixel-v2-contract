// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "base64-sol/base64.sol";
import "./lib/ERC721Enumerable.sol";
import "./lib/ColorUtils.sol";
import "./SVGGenerator.sol";

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

    IERC20 public baseToken;
    bool private _initialized;

    bool public whitelistOnly;
    uint24 public maxSupply; // can be minted up to MAX_SUPPLY
    uint80 public mintingCost; // DIXEL max supply: 1M * 1e18
    uint24 public royaltyFriction; // used for `royaltyInfo` (ERC2981) and `seller_fee_basis_points` (Opeansea's Contract-level metadata)
    uint40 public mintingBeginsFrom; // Timestamp that minting event begins
    uint8[CANVAS_SIZE][CANVAS_SIZE] public pixels; // TODO: using bytes can save gas?

    string public description;
    address[] public whitelist;

    struct EditionData {
        uint24[PALETTE_SIZE] palette; // 24bit color (16,777,216) - up to 16 colors
    }
    EditionData[] private editionData;

    event Mint(address indexed to, uint256 indexed tokenId);
    // event Burn(address indexed player, uint256 indexed tokenId, uint96 refundAmount);

    // solhint-disable-next-line func-visibility
    constructor(address baseTokenAddress) {
        baseToken = IERC20(baseTokenAddress);
    }

    function init(
        address owner_,
        string memory name_,
        string memory symbol_,
        string memory description_,
        bool whitelistOnly_,
        uint24 maxSupply_,
        uint80 mintingCost_,
        uint24 royaltyFriction_,
        uint40 mintingBeginsFrom_,
        uint24[PALETTE_SIZE] memory palette_,
        uint8[CANVAS_SIZE][CANVAS_SIZE] memory pixels_
    ) external {
        require(_initialized == false, "CONTRACT_ALREADY_INITIALIZED");
        _initialized = true;

        // ERC721 attributes
        _name = name_;
        _symbol = symbol_;

        // Custom attributes
        description = description_;
        whitelistOnly = whitelistOnly_;
        maxSupply = maxSupply_;
        mintingCost = mintingCost_;
        royaltyFriction = royaltyFriction_;
        mintingBeginsFrom = mintingBeginsFrom_;

        pixels = pixels_;

        // Transfer ownership to the collection creator, so he/she can edit info on marketplaces like Opeansea
        transferOwnership(owner_);

        // Mint edition #0 to the creator with the default palette set automatically
        mint(owner_, palette_);
    }

    function mint(address to, uint24[PALETTE_SIZE] memory palette) public {

        // TODO: Pay fee

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        uint256 tokenId = _tokenIdTracker.current();
        _safeMint(to, tokenId);

        editionData[tokenId] = EditionData(palette);

        _tokenIdTracker.increment();

        emit Mint(to, tokenId);
    }


    // function getPixelsFor(uint256 tokenId) public view returns (uint24[CANVAS_SIZE][CANVAS_SIZE] memory) {
    //     return history[tokenId].pixels;
    // }

    // function generateSVG(uint256 tokenId) external view returns (string memory) {
    //     return _generateSVG(getPixelsFor(tokenId));
    // }

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


    // MARK: - Override extensions

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable) returns (bool) {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    // function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721Initializable, ERC721Enumerable) {
    //     super._beforeTokenTransfer(from, to, tokenId);
    // }

    // function _afterTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721Initializable) {
    //     super._afterTokenTransfer(from, to, tokenId);
    // }

    /**
     * @dev IERC2981 implementation
     * - NOTE: ERC2981 royalty info may not be applied on some marketplaces
     * - NOTE: Opensea uses contract-level metadata: https://docs.opensea.io/docs/contract-level-metadata
     */
    function royaltyInfo(uint256 /*_tokenId*/, uint256 _salePrice) public view returns (address, uint256) {
        // NOTE:
        // 1. The same royalty friction for all tokens in the same collection
        // 2. Receiver is collection owner

        return (owner(), (_salePrice * royaltyFriction) / 10000);
    }
}
