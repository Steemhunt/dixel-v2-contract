// SPDX-License-Identifier: BSD-3-Clause

pragma solidity =0.8.27;

import "./Shared.sol";

interface IDixelClubV2Factory {
    function beneficiary() external view returns (address);

    function mintingFee() external view returns (uint256);

    function flatFee() external view returns (uint256);
}
