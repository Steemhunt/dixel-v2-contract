const hre = require("hardhat");

async function main() {
  // MARK: - Get Factory
  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const DixelClubV2NFT = await hre.ethers.getContractFactory('DixelClubV2NFT');

  let factoryAddress;
  switch(hre.network.name) {
    case 'goerli':
      factoryAddress = '0x3CddFD28D730c3367a2011f7e63658cE6Aa70270';
      break;
    case 'bsctest':
      factoryAddress = '0x819b19627feB687ce276bF408F4775fF95EE65C3';
      break;
    case 'klaytntest':
      factoryAddress = '0xe87Aa56f99f7b3cC6bc8E63E96Cdd5D9E5440A9F';
      break;
    case 'ethmain':
      factoryAddress = '0x66BF6409A52E634262BD04c0005562f229b03778';
      break;
    case 'bscmain':
      factoryAddress = '0xB76110E9cb56c0dba1596F3413A6DB9023e36463';
      break;
    case 'klaytnmain':
      factoryAddress = '0x31B8eb1d3DcB2C333e5d70cAA022855ffdBD0fDA';
      break;
    default:
      console.log(`Invalid network ${hre.network.name}`);
      process.exit(1);
  }
  const factory = await DixelClubV2Factory.attach(factoryAddress);
  const count = parseInt(await factory.collectionCount());

  console.log(`${hre.network.name} has ${count} collections`);

  for (let i = 0; i < count; i++) {
    const nft = await DixelClubV2NFT.attach(await factory.collections(i));

    console.log(`${i}: ${await nft.name()} - ${nft.address} - V${await nft.version()}`);
  }
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


/* Deploy script

npx hardhat compile && npx hardhat run --network goerli scripts/list-collections.js &&
npx hardhat compile && npx hardhat run --network bsctest scripts/list-collections.js &&
npx hardhat compile && npx hardhat run --network klaytntest scripts/list-collections.js

npx hardhat compile && npx hardhat run --network ethmain scripts/list-collections.js &&
npx hardhat compile && npx hardhat run --network bscmain scripts/list-collections.js &&
npx hardhat compile && npx hardhat run --network klaytnmain scripts/list-collections.js
*/
