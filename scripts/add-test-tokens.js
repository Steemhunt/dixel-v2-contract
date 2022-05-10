const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");
const fs = require('fs');

async function main() {
  const testToken = await hre.ethers.getContractFactory('ERC20PresetMinterPauser');
  const contract = await testToken.attach('0x6D96ECf4E598dd4FeC0c4CBB3862E3bCcf28A144');
  await contract.mint('0x32A935f79ce498aeFF77Acd2F7f35B3aAbC31a2D', '10000000000000000000000');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run --network goerli scripts/add-test-tokens.js