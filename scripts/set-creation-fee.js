const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");

async function main() {
  const config = {
    ethmain: {
      factory: '0x66BF6409A52E634262BD04c0005562f229b03778',
      // fee: ether('0.0')
      fee: ether('0.01')
    },
    klaytnmain: {
      factory: '0x31B8eb1d3DcB2C333e5d70cAA022855ffdBD0fDA',
      // fee: ether('0')
      fee: ether('65')
    },
    bscmain: {
      factory: '0xB76110E9cb56c0dba1596F3413A6DB9023e36463',
      // fee: ether('0')
      fee: ether('0.05')
    },
    okcmain: {
      factory: '0x82b91E6DEDE8B8acDADe2212983DF946CA695d1e',
      // fee: ether('0')
      fee: ether('1')
    },
    polygonmain: {
      factory: '0xa8F498E42884677b4055bEE3cc9970f4A8555ff9',
      // fee: ether('0')
      fee: ether('20')
    },
  };

  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const factory = await DixelClubV2Factory.attach(config[hre.network.name].factory);

  console.log(`Original creation feeon ${hre.network.name} = ${(await factory.creationFee()) / 1e18}`);

  const tx = await factory.updateCreationFee(config[hre.network.name].fee.toString());
  await tx.wait(2);

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
// npx hardhat run --network okcmain scripts/set-creation-fee.js
// npx hardhat run --network polygonmain scripts/set-creation-fee.js
// npx hardhat run --network ethmain scripts/set-creation-fee.js
