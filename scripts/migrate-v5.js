const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0].address;
  console.log(`Deploy from account: ${deployer}`);

  // MARK: - Get Factory
  const DixelClubV2Factory = await hre.ethers.getContractFactory('DixelClubV2Factory');
  const DixelClubV2NFT = await hre.ethers.getContractFactory('DixelClubV2NFT');

  let oldAddress;
  switch(hre.network.name) {
    case 'ethmain':
      oldAddress = '0x66BF6409A52E634262BD04c0005562f229b03778';
      break;
    case 'bscmain':
      oldAddress = '0xB76110E9cb56c0dba1596F3413A6DB9023e36463';
      break;
    case 'polygonmain':
      oldAddress = '0xa8F498E42884677b4055bEE3cc9970f4A8555ff9';
      break;
    case 'klaytnmain':
      oldAddress = '0x31B8eb1d3DcB2C333e5d70cAA022855ffdBD0fDA';
      break;
    default:
      console.log(`Invalid network ${hre.network.name}`);
      process.exit(1);
  }
  const oldFactory = await DixelClubV2Factory.attach(oldAddress);

  let newAddress;
  switch(hre.network.name) {
    case 'ethmain':
      newAddress = '';
      break;
    case 'bscmain':
      newAddress = '';
      break;
    case 'polygonmain':
      newAddress = '';
      break;
    case 'klaytnmain':
      newAddress = '';
      break;
    default:
      console.log(`Invalid network ${hre.network.name}`);
      process.exit(1);
  }
  const newFactory = await DixelClubV2Factory.attach(newAddress);

  // MARK: Get collection list
  const count = await oldFactory.collectionCount();
  console.log(`Migrate ${count} NFTs to the new factory`);

  const newCount = parseInt(await newFactory.collectionCount());
  if (newCount !== 0) {
    console.log(`ERROR: New contract already has ${newCount} collections`);
    process.exit(1);
  }

  for (let i = 0; i < count; i++) {
    const nft = await DixelClubV2NFT.attach(await oldFactory.collections(i));
    const name = await nft.name();
    const version = await nft.version();

    const tx = await newFactory.addCollection(nft.address);

    console.log(`${i}: ${name} - ${nft.address} - v${version}`);
    await tx.wait(1); // waiting for cache expired
  }

  console.log(`New factory has ${await newFactory.collectionCount()} collections now`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

