// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./ERC721Initializable.sol";
import "./IERC721Enumerable.sol";

/**
 * @dev A slightly modified version of ERC721Enumerable.sol (from Openzeppelin 4.6.0) for initialization pattern
 *   - rename ERC721 -> ERC721Initializable
 */
abstract contract ERC721Enumerable is ERC721Initializable, IERC721Enumerable {

    // @dev Store total number of Tokens.
    uint256 private _totalSupply;

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC721Initializable) returns (bool) {
        return interfaceId == type(IERC721Enumerable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Enumerable-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
          _totalSupply += 1;
        } else if (to == address(0)) {
          _totalSupply -= 1;
        }
    }
}
