const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");

async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0].address;
  console.log(`Deploy from account: ${deployer}`);

  // MARK: - Get Factory
  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const DixelClubV2NFT = await hre.ethers.getContractFactory('DixelClubV2NFT');

  let oldAddress;
  switch(hre.network.name) {
    case 'goerli':
      oldAddress = '0x4705d764d68Fb4008644c913dB6f35Da0AD6E47E';
      break;
    case 'bsctest':
      oldAddress = '0xCD18115eA09460658EB6E5B7De8DD9C906024Ac9';
      break;
    case 'klaytntest':
      oldAddress = '0xc827784cbF2EDCbD8874099130721f466113F454';
      break;
    case 'ethmain':
      oldAddress = '0x8b0Fdc91A4e0259ec6a29b3507a7Ea6E1d04A8fF';
      break;
    case 'bscmain':
      oldAddress = '0x690A9370f69058541fb0945185C8af308E799ba9';
      break;
    case 'klaytnmain':
      oldAddress = '0x61D85a893E3193A892979A6dDbBb10Aad5BA3E78';
      break;
    default:
      console.log(`Invalid network ${hre.network.name}`);
      process.exit(1);
  }
  const oldFactory = await DixelClubV2Factory.attach(oldAddress);

  let newAddress;
  switch(hre.network.name) {
    case 'goerli':
      newAddress = '0x3CddFD28D730c3367a2011f7e63658cE6Aa70270';
      break;
    case 'bsctest':
      newAddress = '0x819b19627feB687ce276bF408F4775fF95EE65C3';
      break;
    case 'klaytntest':
      newAddress = '0xe87Aa56f99f7b3cC6bc8E63E96Cdd5D9E5440A9F';
      break;
    case 'ethmain':
      newAddress = '0x66BF6409A52E634262BD04c0005562f229b03778';
      break;
    case 'bscmain':
      newAddress = '0xB76110E9cb56c0dba1596F3413A6DB9023e36463';
      break;
    case 'klaytnmain':
      newAddress = '0x31B8eb1d3DcB2C333e5d70cAA022855ffdBD0fDA';
      break;
    default:
      console.log(`Invalid network ${hre.network.name}`);
      process.exit(1);
  }
  const newFactory = await DixelClubV2Factory.attach(newAddress);

  // MARK: Get collection list
  const count = await oldFactory.collectionCount();
  console.log(`Migrate ${count} NFTs to the new factory`);

  const newCount = parseInt(await newFactory.collectionCount());
  if (newCount !== 0) {
    console.log(`ERROR: New contract already has ${newCount} collections`);
    process.exit(1);
  }

  for (let i = 0; i < count; i++) {
    const nft = await DixelClubV2NFT.attach(await oldFactory.collections(i));
    const name = await nft.name();

    const tx = await newFactory.addCollection(nft.address);

    console.log(`${i}: ${name} - ${nft.address}`);
    await tx.wait(1); // waiting for cache expired
  }

  // let tx = await newFactory.addCollection('0xB3c9d96248ac43f55Df01F83a6fdb7f76F6590F4'); // PI Network
  // await tx.wait(1);

  // tx = await newFactory.addCollection('0xFA963c5FDD1A15D9c464A36331d73651334A66DA'); // EB Pixel Class
  // await tx.wait(1);

  // tx = await newFactory.addCollection('0x2Cd58f1437aAf7d61035E8efc8a32933F6613734'); // unlockers
  // await tx.wait(1);

  // tx = await newFactory.addCollection('0xc5a07185962CfF2A579e16BaC916875aA897b174'); // escapers
  // await tx.wait(1);

  // tx = await newFactory.addCollection('0x6fFc091e488Ae71a678eD84816fBfF1E91B6Db77'); // Lapin Limité de Cuisine
  // await tx.wait(1);

  console.log(`New factory has ${await newFactory.collectionCount()} collections now`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


/* Deploy script

npx hardhat compile && npx hardhat run --network goerli scripts/migrate-v3.js &&
npx hardhat compile && npx hardhat run --network bsctest scripts/migrate-v3.js &&
npx hardhat compile && npx hardhat run --network klaytntest scripts/migrate-v3.js

npx hardhat compile && npx hardhat run --network ethmain scripts/migrate-v3.js &&
npx hardhat compile && npx hardhat run --network bscmain scripts/migrate-v3.js &&
npx hardhat compile && npx hardhat run --network klaytnmain scripts/migrate-v3.js
*/


  // MARK: - updateImplementation
  // const oldImplementation = await factory.nftImplementation();
  // const oldNFT = await DixelClubV2NFT.attach(oldImplementation);
  // const oldVersion = await oldNFT.version();
  // console.log(`Old version: V${oldVersion} - ${oldImplementation}`);

  // MARK: - Deploy NFT contract
  // const nft = await DixelClubV2NFT.deploy();
  // await nft.deployed();
  // console.log(` -> V3 NFT contract deployed at ${nft.address}`);
  // await factory.updateImplementation(nft.address);

  // console.log("Waiting 30 seconds for purge caching...");
  // await sleep(30000);

  // const newImplementation = await factory.nftImplementation();
  // const newNFT = await DixelClubV2NFT.attach(newImplementation);
  // const newVersion = await newNFT.version();

  // if (nft.address === newImplementation) {
  //   console.log(`NFT implementation is updated successfully! V${oldVersion} -> V${newVersion}`);
  // } else {
  //   console.log(`Error on updating:\n  - Deployed: ${nft.address}\n  - Current version: ${newImplementation}`);
  //   process.exit(1);
  // }
