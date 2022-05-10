const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");
const fs = require('fs');

async function main(tester) {
  const testToken = await hre.ethers.getContractFactory('ERC20PresetMinterPauser');
  const contract = await testToken.attach('0xE8Aa938614F83Aa71B08e7f0085c71D01C3a3d77');
  await contract.mint(tester, '10000000000000000000000');
}

const args = process.argv.slice(2);

main(args[0])
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

// HARDHAT_NETWORK=goerli node scripts/add-tokens.js