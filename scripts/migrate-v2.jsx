const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");

async function main() {
  /*
  V1 collections to be migrated (Ethereum):
  [0xE85996269cef98d35503e7DD805363a974B86DF9, 0x516d9aCf6EA2581Ffb56e8251a1f62c899af8AA7]
  */

  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const factory = await DixelClubV2Factory.attach('');

  await factory.addCollection('0xE85996269cef98d35503e7DD805363a974B86DF9');
  await factory.addCollection('0x516d9aCf6EA2581Ffb56e8251a1f62c899af8AA7');

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
