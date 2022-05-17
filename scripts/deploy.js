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

  // MARK: - Deploy Factory
  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const factory = await DixelClubV2Factory.deploy();
  await factory.deployed();
  console.log(` -> DixelClubV2Factory contract deployed at ${factory.address}`);

  const nftImplementation = await factory.nftImplementation();
  console.log(`    -> NFT implementation contract: ${nftImplementation}`);

  console.log('---');
  console.log(`- DixelClubV2Factory: ${factory.address}`);
  console.log(`- DixelClubV2NFT: ${nftImplementation}`);

  console.log(`
    npx hardhat verify --network ${hre.network.name} ${factory.address}
    npx hardhat verify --network ${hre.network.name} ${nftImplementation}
  `);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


// npx hardhat compile && npx hardhat run --network goerli scripts/deploy.js

