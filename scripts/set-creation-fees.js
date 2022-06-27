const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");

async function main() {
  let factoryAdddress = '';
  let fee = '0.1'; // Ethereum
  if (hre.network.name === 'klaytnmain') {
    fee = '400';
  } else if (hre.network.name === 'bscmain') {
    fee = '0.5';
  }

  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const factory = await DixelClubV2Factory.attach('');

  await factory.updateCreationFee(ether(fee));

  const updatedFee = await factory.creationFee();

  console.log(`Creation fee updated on ${hre.network.name} = ${updatedFee}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run --network klaytnmain scripts/set-creation-fee.js
// npx hardhat run --network bscmain scripts/set-creation-fee.js
