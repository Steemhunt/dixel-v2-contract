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
    this.creationFee = await this.factory.creationFee();
  });

  describe("edgecases", function() {
    it("can mint a new edition for free if minting cost is 0", async function() {
      this.receipt = await this.factory.createCollection(
        TEST_DATA.name,
        TEST_DATA.symbol,
        Object.values(Object.assign({}, TEST_DATA.metaData, { mintingCost: 0 })),
        TEST_INPUT.palette,
        TEST_INPUT.pixels,
        { from: alice, value: this.creationFee }
      );
      this.collection = await DixelClubV2NFT.at(this.receipt.logs[1].args.nftAddress);

      const tracker = await balance.tracker(bob, 'wei');
      await this.collection.mint(bob, TEST_INPUT.palette2, { from: bob });
      const { delta, fees } = await tracker.deltaWithFees();

      expect(delta.add(fees)).to.be.bignumber.equal("0");
    });

    // TODO: more edge cases
  });

  describe("minting a new edition", function() {
    beforeEach(async function() {
      this.receipt = await this.factory.createCollection(
        TEST_DATA.name,
        TEST_DATA.symbol,
        Object.values(TEST_DATA.metaData),
        TEST_INPUT.palette,
        TEST_INPUT.pixels,
        { from: alice, value: this.creationFee }
      );
      this.collection = await DixelClubV2NFT.at(this.receipt.logs[1].args.nftAddress);
      this.mintingCost = TEST_DATA.metaData.mintingCost;
      this.mintingFee = this.mintingCost.mul(await this.factory.mintingFee()).div(await this.factory.FRICTION_BASE());
    });

    it("should revert if sending an invalid minting fee", async function() {
      await expectRevert(this.collection.mint(bob, TEST_INPUT.palette2, { from: bob }), "INVALID_MINTING_COST_SENT");

      await expectRevert(this.collection.mint(bob, TEST_INPUT.palette2, { from: bob, value: ether("0.9") }), "INVALID_MINTING_COST_SENT");
    })

    it("should deduct minting cost from bob", async function() {
      const tracker = await balance.tracker(bob, 'wei');
      await this.collection.mint(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
      const { delta, fees } = await tracker.deltaWithFees();

      expect(delta.mul(new BN(-1)).sub(fees)).to.be.bignumber.equal(this.mintingCost);
    });

    it("should send minting cost to the collection owner (alice) after deducting minting fee", async function() {
      const tracker = await balance.tracker(alice, 'wei');
      await this.collection.mint(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
      const delta = await tracker.delta();

      expect(delta).to.be.bignumber.equal(this.mintingCost.sub(this.mintingFee));
    });

    it("should send minting fee to the beneficiary", async function() {
      const tracker = await balance.tracker(await this.factory.beneficiary(), 'wei');
      await this.collection.mint(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
      const delta = await tracker.delta();

      expect(delta).to.be.bignumber.equal(this.mintingFee);
    });

    describe("generate SVG and tokenURI", function() {
      beforeEach(async function() {
        await this.collection.mint(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
      });

      it("should generate a new SVG image for the new edition", async function() {
        const svg = fs.readFileSync(`${__dirname}/fixtures/test-svg2.svg`, 'utf8');
        expect(await this.collection.generateSVG(1)).to.equal(svg);
      });

      it("should generate a base64 encoded SVG image correctly", async function() {
        const base64 = fs.readFileSync(`${__dirname}/fixtures/test-svg2.base64`, 'utf8');
        expect(await this.collection.generateBase64SVG(1)).to.equal(base64);
      });

      it("should generate a correct JSON output", async function() {
        const json = fs.readFileSync(`${__dirname}/fixtures/test.json`, 'utf8');
        expect(await this.collection.generateJSON(1)).to.equal(json);
      });
    });

    // TODO:
  });

  // TODO: burn
});
