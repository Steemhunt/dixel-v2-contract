const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");

async function main() {
  const config = {
    klaytnmain: {
      factory: '0x61D85a893E3193A892979A6dDbBb10Aad5BA3E78',
      fee: ether('400')
    },
    bscmain: {
      factory: '0x690A9370f69058541fb0945185C8af308E799ba9',
      fee: ether('0.5')
    }
  };

  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const factory = await DixelClubV2Factory.attach(config[hre.network.name].factory);

  // await factory.updateCreationFee(config[hre.network.name].fee.toString());

  const updatedFee = await factory.creationFee();
  console.log(`Creation fee updated on ${hre.network.name} = ${updatedFee / 1e18}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run --network klaytnmain scripts/set-creation-fee.js
// npx hardhat run --network bscmain scripts/set-creation-fee.js
