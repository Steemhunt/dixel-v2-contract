// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");

async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0].address;
  console.log(`Deploy from account: ${deployer}`);

  // MARK: - Deploy NFT contract
  const DixelClubV2NFT = await hre.ethers.getContractFactory('DixelClubV2NFT');
  const nft = await DixelClubV2NFT.deploy();
  await nft.deployed();
  console.log(` -> DixelClubV2NFT contract deployed at ${nft.address}`);

  // MARK: - Deploy Factory
  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const factory = await DixelClubV2Factory.deploy(nft.address);
  await factory.deployed();
  console.log(` -> DixelClubV2Factory contract deployed at ${factory.address}`);

  console.log(`Network: ${hre.network.name}`);
  console.log('```');
  console.log(`- DixelClubV2Factory: ${factory.address}`);
  console.log(`- DixelClubV2NFT (implementation): ${nft.address}`);
  console.log('```');

  console.log(`
    npx hardhat verify --network ${hre.network.name} ${nft.address}
    npx hardhat verify --network ${hre.network.name} ${factory.address} '${nft.address}'
  `);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


/* Deploy script

npx hardhat compile && npx hardhat run --network goerli scripts/deploy.js
npx hardhat compile && npx hardhat run --network bsctest scripts/deploy.js
npx hardhat compile && npx hardhat run --network klaytntest scripts/deploy.js
npx hardhat compile && npx hardhat run --network okctest scripts/deploy.js
npx hardhat compile && npx hardhat run --network polygontest scripts/deploy.js

npx hardhat compile && npx hardhat run --network ethmain scripts/deploy.js
npx hardhat compile && npx hardhat run --network bscmain scripts/deploy.js
npx hardhat compile && npx hardhat run --network klaytnmain scripts/deploy.js
npx hardhat compile && npx hardhat run --network okcmain scripts/deploy.js
npx hardhat compile && npx hardhat run --network polygonmain scripts/deploy.js
npx hardhat compile && npx hardhat run --network base scripts/deploy.js
*/
