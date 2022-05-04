const { ethers } = require('hardhat');
const { ether, BN, constants, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
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

contract("DixelClubV2Factory", function(accounts) {
  const [ deployer, alice ] = accounts;

  beforeEach(async function() {
    this.factory = await DixelClubV2Factory.new();
  });

  describe("initial status", function() {
    it("should have zero collections", async function() {
      expect(await this.factory.collectionCount()).to.be.bignumber.equal("0");
    });

    it("should initialize nft implementation contract", async function() {
      assert.notEqual(await this.factory.nftImplementation(), ZERO_ADDRESS);
    });

    it("nft implementation should have its factory contract as original owner", async function() {
      const nft = await DixelClubV2NFT.at(await this.factory.nftImplementation());
      expect(await nft.owner()).to.equal(this.factory.address);
    });
  });

  describe("create a collection", function() {
    beforeEach(async function() {
      this.receipt = await this.factory.createCollection(
        TEST_DATA.name,
        TEST_DATA.symbol,
        Object.values(TEST_DATA.metaData),
        TEST_INPUT.palette,
        TEST_INPUT.pixels,
        { from: alice }
      );
      this.collection = await DixelClubV2NFT.at(this.receipt.logs[0].args.nftAddress);
    });

    it("should have correct ERC721 attributes", async function() {
      expect(await this.collection.name()).to.equal(TEST_DATA.name);
      expect(await this.collection.symbol()).to.equal(TEST_DATA.symbol);
    });

    it("should have correct collection meta data", async function() {
      const [
        , // name
        , // symbol
        whitelistOnly,
        maxSupply,
        royaltyFriction,
        mintingBeginsFrom,
        mintingCost,
        description,
        , // totalSupply
        pixels
      ] = Object.values(await this.collection.collectionMetaData());

      expect(whitelistOnly).to.equal(TEST_DATA.metaData.whitelistOnly);
      expect(maxSupply).to.be.bignumber.equal(String(TEST_DATA.metaData.maxSupply));
      expect(royaltyFriction).to.be.bignumber.equal(String(TEST_DATA.metaData.royaltyFriction));
      expect(mintingBeginsFrom).to.be.bignumber.equal(String(TEST_DATA.metaData.mintingBeginsFrom));
      expect(mintingCost).to.be.bignumber.equal(String(TEST_DATA.metaData.mintingCost));
      expect(description).to.equal(TEST_DATA.metaData.description);

      for(const i in TEST_INPUT.pixels) {
        expect(pixels[i]).to.be.bignumber.equal(String(TEST_INPUT.pixels[i]));
      }
    });

    it('should emit CollectionCreated event', async function() {
      expectEvent(this.receipt, 'CollectionCreated', { nftAddress: this.collection.address, name: TEST_DATA.name, symbol: TEST_DATA.symbol });
    });

    it("should have 1 collection on factory", async function() {
      expect(await this.factory.collectionCount()).to.be.bignumber.equal("1");
    });

    it("should have store the new collection address on index 0", async function() {
      expect(await this.factory.collections("0")).to.equal(this.collection.address);
    });

    it("should have the alice as the collection owner", async function() {
      expect(await this.collection.owner()).to.equal(alice);
    });

    describe("should mint #0 edition to the creator", function() {
      it("should mint #0 edition", async function() {
        expect(await this.collection.totalSupply()).to.be.bignumber.equal("1");
      });

      it("should be sent to the creator", async function () {
        expect(await this.collection.ownerOf(0)).to.equal(alice);
      });

      it("should have correct palette data", async function () {
        const palette = await this.collection.paletteOf(0);
        for(const i in TEST_INPUT.palette) {
          expect(palette[i]).to.be.bignumber.equal(String(TEST_INPUT.palette[i]));
        }
      });

      it.only("should have generate correct SVG image", async function() {
        const svg = fs.readFileSync(`${__dirname}/fixtures/test-svg.svg`, 'utf8');
        expect(await this.collection.generateSVG(0)).to.equal(svg);
      });
      // TODO: more edition data - tokenURI
    });
  }); // create a collection
});
