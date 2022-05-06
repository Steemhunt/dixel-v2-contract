const { ether, balance, BN, constants, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { MAX_UINT256, ZERO_ADDRESS } = constants;
const { expect } = require("chai");
const fs = require("fs");

const DixelClubV2Factory = artifacts.require("DixelClubV2Factory");
const DixelClubV2NFT = artifacts.require("DixelClubV2NFT");

const TEST_INPUT = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/test-input.json`, 'utf8'));
const TEST_DATA = {
  name: 'Test Collection',
  symbol: 'TESTNFT',
  metaData: {
    whitelistOnly: false,
    maxSupply: 10,
    royaltyFriction: 500, // 5%
    mintingBeginsFrom: 0, // start immediately
    mintingCost: ether("1"),
    description: 'This is a test collection',
  }
};

contract("DixelClubV2NFT", function(accounts) {
  const [ deployer, alice, bob ] = accounts;

  beforeEach(async function() {
    this.factory = await DixelClubV2Factory.new();
    this.receipt = await this.factory.createCollection(
      TEST_DATA.name,
      TEST_DATA.symbol,
      Object.values(TEST_DATA.metaData),
      TEST_INPUT.palette,
      TEST_INPUT.pixels,
      { from: alice }
    );
    this.collection = await DixelClubV2NFT.at(this.receipt.logs[1].args.nftAddress);
  });

  describe.only("minting a new edition", function() {
    beforeEach(async function() {
      this.initialBalance = await balance.current(bob); // 10,000
      this.mintingCost = TEST_DATA.metaData.mintingCost;
      this.mintingFee = this.mintingCost.mul(await this.factory.mintingFee()).div(await this.factory.FRICTION_BASE());

      this.collection.mint(bob, TEST_INPUT.palette2, { from: bob });
    });

    it('should deduct minting cost from bob', async function() {
      console.log(String(this.initialBalance), ' -------', String(this.mintingCost));
      expect(await balance.current(bob)).to.be.bignumber.equal(this.initialBalance.sub(this.mintingCost));
    });

    // TODO:
    // it('should send minting fee to beneficiary', async function() {
    // });

    // TODO: creator(alice) balance increase
  });
});
