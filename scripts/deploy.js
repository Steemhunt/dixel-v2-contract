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
  console.log(`- DixelClubV2NFT: ${nft.address}`);
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

npx hardhat compile && npx hardhat run --network goerli scripts/deploy.js &&
npx hardhat compile && npx hardhat run --network bsctest scripts/deploy.js &&
npx hardhat compile && npx hardhat run --network klaytntest scripts/deploy.js

npx hardhat compile && npx hardhat run --network ethmain scripts/deploy.js &&
npx hardhat compile && npx hardhat run --network bscmain scripts/deploy.js &&
npx hardhat compile && npx hardhat run --network klaytnmain scripts/deploy.js
*/


/* Mainnet deploy logs

<NFT V1 / 2.4>

BSC
- DixelClubV2Factory: 0x59406730b52184F3766cf8fde555E90978187a7F
- DixelClubV2NFT: 0x7b5856b5D9dB47Ec4301F1A82D47aC36AF00f881

Klaytn
- DixelClubV2Factory: 0xA40Dcfa00F3d9C82e27753D887018E57dA84B179
- DixelClubV2NFT: 0xaF598d12c62B7320D006B497d1a9DF9EdB4bf131

Etherum
- DixelClubV2Factory: 0xC37B62494B2CB7991d64b6648700B7563f6E99eD
- DixelClubV2NFT: 0xa8F498E42884677b4055bEE3cc9970f4A8555ff9

---

<NFT V2 / 2.6.124>

BSC
- DixelClubV2Factory: 0x690A9370f69058541fb0945185C8af308E799ba9
- DixelClubV2NFT: 0x0b19b861CC48b2b5460529a41485f1c045471e67

Klaytn
- DixelClubV2Factory: 0x61D85a893E3193A892979A6dDbBb10Aad5BA3E78
- DixelClubV2NFT: 0xBDc7293F6b4690294AF64Aea3F8BE2Dd943B4Bde

Etherum
- DixelClubV2Factory: 0x8b0Fdc91A4e0259ec6a29b3507a7Ea6E1d04A8fF
- DixelClubV2NFT: 0x3c176B2929FB96DaeaB9705B0A0959B1DDa32D10
*/
