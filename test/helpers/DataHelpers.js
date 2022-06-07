const { ether } = require("@openzeppelin/test-helpers");
const fs = require("fs");

const TEST_INPUT = JSON.parse(fs.readFileSync(`${__dirname}/../fixtures/test-input.json`, 'utf8'));
const TEST_DATA = {
  name: 'Test Collection',
  symbol: 'TESTNFT',
  description: 'This is a test collection',
  metaData: {
    whitelistOnly: false,
    hidden: false,
    maxSupply: 10,
    royaltyFriction: 500, // 5%
    mintingBeginsFrom: 0, // start immediately
    mintingCost: ether("1"),
  }
};

async function createCollection(factory, nft, creator, customMetaData = {}, customDesc = "", customPixels = "") {
  const receipt = await factory.createCollection(
    TEST_DATA.name,
    TEST_DATA.symbol,
    customDesc || TEST_DATA.description,
    Object.values(Object.assign({}, TEST_DATA.metaData, customMetaData)),
    TEST_INPUT.palette,
    customPixels || TEST_INPUT.pixels,
    { from: creator, value: await factory.creationFee() }
  );
  return await nft.at(receipt.logs[1].args.nftAddress);
}

function generateRandomAddress() {
  return '0x' + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateRandomAddresses(count) {
  return [...Array(count)].map(() => generateRandomAddress());
}

module.exports = {
  TEST_INPUT,
  TEST_DATA,
  createCollection,
  generateRandomAddresses
};