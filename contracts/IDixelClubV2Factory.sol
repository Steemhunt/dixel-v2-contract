// SPDX-License-Identifier: BSD-3-Clause

pragma solidity ^0.8.13;

import "./Shared.sol";

interface IDixelClubV2Factory {
  function FRICTION_BASE (  ) external view returns ( uint256 );
  function MAX_ROYALTY_FRACTION (  ) external view returns ( uint256 );
  function MAX_SUPPLY (  ) external view returns ( uint256 );
  function beneficiary (  ) external view returns ( address );
  function collectionCount (  ) external view returns ( uint256 );
  function collections ( uint256 ) external view returns ( address );
  function createCollection ( string memory name, string memory symbol, Shared.MetaData memory metaData, uint24[16] memory palette, uint8[288] memory pixels ) external returns ( address );
  function creationFee (  ) external view returns ( uint256 );
  function mintingFee (  ) external view returns ( uint256 );
  function nftImplementation (  ) external view returns ( address );
  function owner (  ) external view returns ( address );
  function renounceOwnership (  ) external;
  function transferOwnership ( address newOwner ) external;
  function updateBeneficiary ( address newAddress, uint256 newCreationFee, uint256 newMintingFee ) external;
  function updateImplementation ( address newImplementation ) external;
}
