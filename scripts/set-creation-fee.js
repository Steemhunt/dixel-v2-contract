const hre = require("hardhat");
const { ether } = require("@openzeppelin/test-helpers");

async function main() {
  const config = {
    ethmain: {
      factory: '0x43c71D3fAb7CE185C4D569f8fc3C93dF95334c57',
      fee: ether('0.000111') // 0.000111 ETH (~$0.3)
    },
    base: {
      factory: '0x8b0Fdc91A4e0259ec6a29b3507a7Ea6E1d04A8fF',
      fee: ether('0.000111') // 0.000111 ETH (~$0.3)
    },
    // same for all ETH based chains
    klaytnmain: {
      factory: '0x82b91E6DEDE8B8acDADe2212983DF946CA695d1e',
      fee: ether('3') // 3 KLAY (~$0.3)
    },
    bscmain: {
      factory: '0x9326c3A25935d11a6510a0A4eb18233AB2963f38',
      fee: ether('0.0005') // 0.0005 BNB (~$0.3)
    },
    polygonmain: {
      factory: '0x0E5F42f6308C13dBf9c7e18B5bd956048A50486f',
      fee: ether('1') // 1 POL (~$0.3)
    },
  };

  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const factory = await DixelClubV2Factory.attach(config[hre.network.name].factory);

  console.log(`Original creation feeon ${hre.network.name} = ${(await factory.creationFee()) / 1e18}`);

  const tx = await factory.updateCreationFee(config[hre.network.name].fee.toString());
  await tx.wait(2);

  const tx2 = await factory.updateFlatFee(config[hre.network.name].fee.toString());
  await tx2.wait(2);

  console.log(`Creation fee updated on ${hre.network.name} = ${await factory.creationFee() / 1e18}`);
  console.log(`Flat fee updated on ${hre.network.name} = ${await factory.flatFee() / 1e18}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

// npx hardhat run --network klaytnmain scripts/set-creation-fee.js
// npx hardhat run --network polygonmain scripts/set-creation-fee.js
// npx hardhat run --network bscmain scripts/set-creation-fee.js
