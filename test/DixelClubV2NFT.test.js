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

async function createCollection(factory, creator, customMetaData = {}) {
  const receipt = await factory.createCollection(
    TEST_DATA.name,
    TEST_DATA.symbol,
    Object.values(Object.assign({}, TEST_DATA.metaData, customMetaData)),
    TEST_INPUT.palette,
    TEST_INPUT.pixels,
    { from: creator, value: await factory.creationFee() }
  );
  return await DixelClubV2NFT.at(receipt.logs[1].args.nftAddress);
}

contract("DixelClubV2NFT", function(accounts) {
  const [ deployer, alice, bob, carol ] = accounts;

  beforeEach(async function() {
    this.factory = await DixelClubV2Factory.new();
    this.mintingCost = TEST_DATA.metaData.mintingCost;
  });

  describe("edgecases", function() {
    it("can mint a new edition for free if minting cost is 0", async function() {
      const collection = await createCollection(this.factory, alice, { mintingCost: 0 });

      const tracker = await balance.tracker(bob, 'wei');
      await collection.mint(bob, TEST_INPUT.palette2, { from: bob });
      const { delta, fees } = await tracker.deltaWithFees();

      expect(delta.add(fees)).to.be.bignumber.equal("0");
    });

    it("cannot initialize again", async function () {
      const collection = await createCollection(this.factory);

      await expectRevert(
        collection.init(alice, TEST_DATA.name, TEST_DATA.symbol, Object.values(TEST_DATA.metaData), TEST_INPUT.palette, TEST_INPUT.pixels),
        "CONTRACT_ALREADY_INITIALIZED"
      );
    });

    it("cannot mint over maxSupply", async function() {
      // Edition #0 is already minted on createCollection
      const collection = await createCollection(this.factory, alice, { maxSupply: 3, mintingCost: 0 }); // count: 1
      await collection.mint(alice, TEST_INPUT.palette2, { from: alice }); // count: 2
      await collection.mint(bob, TEST_INPUT.palette2, { from: bob }); // count: 3

      await expectRevert(
        collection.mint(carol, TEST_INPUT.palette2, { from: carol }),
        "MAX_SUPPLY_REACHED"
      );
    });

    it("cannot mint (maxSupply - 1)th edition even if someone burned a token", async function() {
      const collection = await createCollection(this.factory, alice, { maxSupply: 2, mintingCost: 0 }); // edition: 0
      await collection.mint(alice, TEST_INPUT.palette2, { from: alice }); // edition: 1

      await collection.burn("1", { from: alice });

      expect(await collection.totalSupply()).to.be.bignumber.equal("1");
      await expectRevert(
        collection.mint(bob, TEST_INPUT.palette2, { from: bob }),
        "MAX_SUPPLY_REACHED"
      );
    });

    it("cannot mint before mintingBeginsFrom", async function() {
      const now = parseInt((new Date()).getTime() / 1000);
      const collection = await createCollection(this.factory, alice, { mintingCost: 0, mintingBeginsFrom: now + 1000 });

      await expectRevert(
        collection.mint(bob, TEST_INPUT.palette2, { from: bob }),
        "MINTING_NOT_STARTED_YET"
      );
    });
  });

  describe("minting a new edition", function() {
    beforeEach(async function() {
      this.collection = await createCollection(this.factory, alice);
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

  describe("whitelist", function() {
    beforeEach(async function() {
      this.collection = await createCollection(this.factory, alice, { whitelistOnly: true });

      await this.collection.setWhitelist([[ alice, "1" ], [ bob, "1" ]], { from: alice });
      await this.collection.mint(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
    });

    it("setWhitelist can be only called by the owner of the collection", async function() {
      await expectRevert(
        this.collection.setWhitelist([[ bob, "1" ]], { from: bob }),
        "Ownable: caller is not the owner"
      );
    });

    it("should not allow except whitelisted wallet to mint", async function() {
      await expectRevert(
        this.collection.mint(carol, TEST_INPUT.palette2, { from: carol, value: this.mintingCost }),
        "NOT_IN_WTHIELIST"
      );
    });

    it("cannot mint more than allowance", async function() {
      await expectRevert(
        this.collection.mint(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost }),
        "NOT_IN_WTHIELIST"
      );
    });

    it("should decrease the allowance after minting", async function() {
      expect(await this.collection.getWhitelistAllowanceLeft(bob)).to.be.bignumber.equal("0");
    });

    it("should return a correct unique whitelist wallet count", async function() {
      expect(await this.collection.getWhitelistWalletCount()).to.be.bignumber.equal("2");
    });

    it("should return a correct allowance left after 1 minting", async function() {
      expect(await this.collection.getWhitelistTotalAllowanceLeft()).to.be.bignumber.equal("1");
    });

    it("should return all whitelist correctly", async function() {
      const list = await this.collection.getAllWhitelist("0", "100");
      expect(list[0].wallet).to.equal(alice);
      expect(list[0].allowance).to.be.bignumber.equal("1");
      expect(list[1].wallet).to.equal(bob);
      expect(list[1].allowance).to.be.bignumber.equal("0");
    });
  }); // whitelist
});
