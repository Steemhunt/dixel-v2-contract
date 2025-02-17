const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0].address;
  console.log(`Deploy from account: ${deployer}`);

  // MARK: - Get Factory
  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const DixelClubV2NFT = await hre.ethers.getContractFactory('DixelClubV2NFT');

  let factoryAddress;
  switch(hre.network.name) {
    case 'ethmain':
      factoryAddress = '0x43c71D3fAb7CE185C4D569f8fc3C93dF95334c57';
      break;
    case 'base':
      factoryAddress = '0x8b0Fdc91A4e0259ec6a29b3507a7Ea6E1d04A8fF';
      break;
    case 'bscmain':
      factoryAddress = '0x9326c3A25935d11a6510a0A4eb18233AB2963f38';
      break;
    case 'klaytnmain':
      factoryAddress = '0x82b91E6DEDE8B8acDADe2212983DF946CA695d1e';
      break;
    case 'polygonmain':
      factoryAddress = '0x0E5F42f6308C13dBf9c7e18B5bd956048A50486f';
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
  console.log(` -> V6 NFT contract deployed at ${nft.address}`);
  const tx = await factory.updateImplementation(nft.address);
  console.log("Updating NFT implementation...");
  await tx.wait(2); // waiting for confirmation

  const newImplementation = await factory.nftImplementation();
  const newNFT = await DixelClubV2NFT.attach(newImplementation);
  const newVersion = await newNFT.version();

  if (nft.address === newImplementation) {
    console.log(`NFT implementation is updated successfully! V${oldVersion} -> V${newVersion}`);
  } else {
    console.log(`Error on updating:\n  - Deployed: ${nft.address}\n  - Current version: ${newImplementation}`);
    process.exit(1);
  }

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

npx hardhat compile && npx hardhat run --network base scripts/migrate-v6.js &&
npx hardhat compile && npx hardhat run --network bscmain scripts/migrate-v6.js &&
npx hardhat compile && npx hardhat run --network klaytnmain scripts/migrate-v6.js &&
npx hardhat compile && npx hardhat run --network polygonmain scripts/migrate-v6.js &&
npx hardhat compile && npx hardhat run --network ethmain scripts/migrate-v6.js

*/
