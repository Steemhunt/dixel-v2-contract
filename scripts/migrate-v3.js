const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0].address;
  console.log(`Deploy from account: ${deployer}`);

  // MARK: - Get Factory
  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const DixelClubV2NFT = await hre.ethers.getContractFactory('DixelClubV2NFT');

  let factoryAddress;
  switch(hre.network.name) {
    case 'goerli':
      factoryAddress = '0x4705d764d68Fb4008644c913dB6f35Da0AD6E47E';
      break;
    case 'bsctest':
      factoryAddress = '0xCD18115eA09460658EB6E5B7De8DD9C906024Ac9';
      break;
    case 'klaytntest':
      factoryAddress = '0xc827784cbF2EDCbD8874099130721f466113F454';
      break;
    case 'ethmain':
      factoryAddress = '0x8b0Fdc91A4e0259ec6a29b3507a7Ea6E1d04A8fF';
      break;
    case 'bscmain':
      factoryAddress = '0x690A9370f69058541fb0945185C8af308E799ba9';
      break;
    case 'klaytnmain':
      factoryAddress = '0x61D85a893E3193A892979A6dDbBb10Aad5BA3E78';
      break;
    default:
      console.log(`Invalid network ${hre.network.name}`);
      process.exit(1);
  }
  const factory = await DixelClubV2Factory.attach(factoryAddress);

  // MARK: - updateImplementation
  const oldImplementation = await factory.nftImplementation();
  const oldNFT = await DixelClubV2NFT.attach(oldImplementation);
  const oldVersion = await oldNFT.version();
  console.log(`Old version: V${oldVersion} - ${oldImplementation}`);

  // MARK: - Deploy NFT contract
  const nft = await DixelClubV2NFT.deploy();
  await nft.deployed();
  console.log(` -> V3 NFT contract deployed at ${nft.address}`);

  await factory.updateImplementation(nft.address);

  console.log("Waiting 30 seconds for purge caching...");
  await sleep(30000);

  const newImplementation = await factory.nftImplementation();
  const newNFT = await DixelClubV2NFT.attach(newImplementation);
  const newVersion = await newNFT.version();

  if (nft.address === newImplementation) {
    console.log(`NFT implementation is updated successfully! V${oldVersion} -> V${newVersion}`);
  } else {
    console.log(`Error on updating:\n  - Deployed: ${nft.address}\n  - Current version: ${newImplementation}`);
    process.exit(1);
  }

  console.log(`Network: ${hre.network.name}`);
  console.log('```');
  console.log(`- V3 NFT: ${nft.address}`);
  console.log('```');

  console.log(`
    npx hardhat verify --network ${hre.network.name} ${nft.address}
  `);
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
