const hre = require("hardhat");

async function main() {
  /*
  V1 collections to be migrated (Ethereum):
  [0xE85996269cef98d35503e7DD805363a974B86DF9, 0x516d9aCf6EA2581Ffb56e8251a1f62c899af8AA7]
  */

  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const factory = await DixelClubV2Factory.attach('0x8b0Fdc91A4e0259ec6a29b3507a7Ea6E1d04A8fF');

  // await factory.addCollection('0xE85996269cef98d35503e7DD805363a974B86DF9'); // ApeFriends 2022
  // await factory.addCollection('0x516d9aCf6EA2581Ffb56e8251a1f62c899af8AA7'); // Starport

  const newCount = await factory.collectionCount();

  console.log(`Collection added: count = ${newCount}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run --network ethmain scripts/migrate-v2.js
