const { ether, balance, time, BN, constants, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { MAX_UINT256, ZERO_ADDRESS } = constants;
const { expect } = require("chai");
const fs = require("fs");

const DixelClubV2Factory = artifacts.require("DixelClubV2Factory");
const DixelClubV2NFT = artifacts.require("DixelClubV2NFT");
const DixelClubV2NFTMock = artifacts.require("DixelClubV2NFTMock");

const { TEST_INPUT, TEST_DATA } = require("./helpers/DataHelpers");

contract("DixelClubV2Factory", function(accounts) {
  const [ deployer, alice, bob ] = accounts;

  beforeEach(async function() {
    this.impl = await DixelClubV2NFT.new();
    this.factory = await DixelClubV2Factory.new(this.impl.address);
    this.creationFee = await this.factory.creationFee();
    this.beneficiary = await this.factory.beneficiary();

    this.testParams = [
      TEST_DATA.name,
      TEST_DATA.symbol,
      TEST_DATA.description,
      Object.values(TEST_DATA.metaData),
      TEST_INPUT.palette,
      TEST_INPUT.pixels,
      { from: alice, value: this.creationFee }
    ];
  });

  describe("initial status", function() {
    it("should have zero collections", async function() {
      expect(await this.factory.collectionCount()).to.be.bignumber.equal("0");
    });

    it("should initialize nft implementation contract", async function() {
      assert.notEqual(await this.factory.nftImplementation(), ZERO_ADDRESS);
    });

    it("nft implementation should have its deployer as original owner", async function() {
      const nft = await DixelClubV2NFT.at(await this.factory.nftImplementation());
      expect(await nft.owner()).to.equal(deployer);
    });
  });

  describe("permission restriction on admin functions", function() {
    it('non-owner should not be able to update implementation', async function () {
      const v2Implementation = await DixelClubV2NFTMock.new();
      await expectRevert(
        this.factory.updateImplementation(v2Implementation.address, { from: alice }),
        "Ownable: caller is not the owner"
      );
    });

    it('non-owner should not be able to update beneficiary', async function () {
      await expectRevert(
        this.factory.updateBeneficiary(alice, { from: alice }),
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("Upgrade NFT implementation", function () {
    beforeEach(async function() {
      await this.factory.createCollection(...this.testParams);
      this.collection0 = await DixelClubV2NFT.at(await this.factory.collections("0"));

      const v2Implementation = await DixelClubV2NFTMock.new();
      await this.factory.updateImplementation(v2Implementation.address);

      await this.factory.createCollection(...this.testParams);
      this.collection1 = await DixelClubV2NFT.at(await this.factory.collections("1"));
    });

    it("should be version 5 originally", async function () {
      expect(await this.collection0.version()).to.be.bignumber.equal("4");
    });

    it("should be version 6 after updateImplementation", async function () {
      expect(await this.collection1.version()).to.be.bignumber.equal("5");
    });

    it("should be ramained as version 5 after one more creation", async function () {
      await this.factory.createCollection(...this.testParams);
      const collection2 = await DixelClubV2NFT.at(await this.factory.collections("2"));

      expect(await collection2.version()).to.be.bignumber.equal("5");
    });
  });

  describe("Update beneficiary information", function() {
    it("should change beneficiary address", async function() {
      await this.factory.updateBeneficiary(bob);
      expect(await this.factory.beneficiary()).to.equal(bob);
    });

    it("should change creation fee to 0.123 ether", async function() {
      await this.factory.updateCreationFee(ether("0.123"));
      expect(await this.factory.creationFee()).to.be.bignumber.equal(ether("0.123"));
    });

    it("should change minting fee to 10%", async function() {
      await this.factory.updateMintingFee("1000");
      expect(await this.factory.mintingFee()).to.be.bignumber.equal("1000");
    });
  });

  describe("Update beneficiary - edge cases", function() {
    it("should not be able to set beneficiary as zero address", async function() {
      await expectRevert(
        this.factory.updateBeneficiary(ZERO_ADDRESS),
        "DixelClubV2Factory__ZeroAddress"
      );
    });
    it("should not be able to set mintingFee over base friction (10,000)", async function() {
      await expectRevert(
        this.factory.updateMintingFee("10001"),
        "DixelClubV2Factory__InvalidFee"
      );
    });
  });

  describe("create a collection - validation", function() {
    it("should check if name is blank", async function() {
      this.testParams[0] = "";
      await expectRevert(this.factory.createCollection(...this.testParams), "DixelClubV2Factory__BlankedName");
    });
    it("should check if symbol is blank", async function() {
      this.testParams[1] = "";
      await expectRevert(this.factory.createCollection(...this.testParams), "DixelClubV2Factory__BlankedSymbol");
    });
    it("should check if maxSupply is over 0", async function() {
      this.testParams[3][2] = 0;
      await expectRevert(this.factory.createCollection(...this.testParams), "DixelClubV2Factory__InvalidMaxSupply");
    });
    it("should check if maxSupply is less than the max value", async function() {
      this.testParams[3][2] = (await this.factory.MAX_SUPPLY()).add(new BN("1"));
      await expectRevert(this.factory.createCollection(...this.testParams), "DixelClubV2Factory__InvalidMaxSupply");
    });
    it("should check if royaltyFriction is less than the max value", async function() {
      this.testParams[3][3] = (await this.factory.MAX_ROYALTY_FRACTION()).add(new BN("1"));
      await expectRevert(this.factory.createCollection(...this.testParams), "DixelClubV2Factory__InvalidRoyalty");
    });
    it("should check if description is over 1,000 characters", async function() {
      this.testParams[2] = [...Array(1001)].map(() => Math.random().toString(36)[2]).join('');
      await expectRevert(this.factory.createCollection(...this.testParams), "DixelClubV2Factory__DescriptionTooLong");
    });

    it("should check if the correct creation fee has sent", async function() {
      this.testParams[6].value = this.creationFee.sub(new BN("1"));
      await expectRevert(this.factory.createCollection(...this.testParams), "DixelClubV2Factory__InvalidCreationFee");
    });
  });

  describe("creation fee", function() {
    it("should take cration fee from the creator", async function() {
      const tracker = await balance.tracker(alice, 'wei');
      await this.factory.createCollection(...this.testParams);
      const { delta, fees } = await tracker.deltaWithFees();

      expect(delta.add(fees)).to.be.bignumber.equal(this.creationFee.mul(new BN(-1)));
    });

    it("should send cration fee to the beneficiary", async function() {
      const tracker = await balance.tracker(this.beneficiary, 'wei');
      await this.factory.createCollection(...this.testParams);
      const delta = await tracker.delta();

      expect(delta).to.be.bignumber.equal(this.creationFee);
    });
  });

  describe("create a collection", function() {
    beforeEach(async function() {
      this.receipt = await this.factory.createCollection(...this.testParams);
      this.collection = await DixelClubV2NFT.at(this.receipt.logs[1].args.nftAddress);
    });

    it("should have correct ERC721 attributes", async function() {
      expect(await this.collection.name()).to.equal(TEST_DATA.name);
      expect(await this.collection.symbol()).to.equal(TEST_DATA.symbol);
    });

    describe("should have correct collection list data", function() {
      beforeEach(async function() {
        this.listData = await this.collection.listData();
      });

      it("initializedAt", async function() {
        // Fuzzy checking on `initializedAt` timestamp
        const now = await time.latest();
        expect(this.listData.initializedAt_).to.be.bignumber.lte(now);
        expect(this.listData.initializedAt_).to.be.bignumber.gt(now.sub(new BN("20")));
      });
      it("hidden", async function() {
        expect(this.listData.hidden_).to.equal(TEST_DATA.metaData.hidden);
      });
    });

    describe("should have correct collection meta data", function() {
      beforeEach(async function() {
        this.metaData = await this.collection.metaData();
      });

      it("whitelistOnly", async function() {
        expect(this.metaData.whitelistOnly_).to.equal(TEST_DATA.metaData.whitelistOnly);
      });
      it("maxSupply", async function() {
        expect(this.metaData.maxSupply_).to.be.bignumber.equal(String(TEST_DATA.metaData.maxSupply));
      });
      it("royaltyFriction", async function() {
        expect(this.metaData.royaltyFriction_).to.be.bignumber.equal(String(TEST_DATA.metaData.royaltyFriction));
      });
      it("mintingBeginsFrom", async function() {
        const now = await time.latest();
        expect(this.metaData.mintingBeginsFrom_).to.be.bignumber.lte(now); // will be set to the current time if "0"
      });
      it("mintingCost", async function() {
        expect(this.metaData.mintingCost_).to.be.bignumber.equal(String(TEST_DATA.metaData.mintingCost));
      });
      it("nextTokenId", async function() {
        expect(this.metaData.nextTokenId_).to.be.bignumber.equal("1");
      });
      it("totalSupply", async function() {
        expect(this.metaData.totalSupply_).to.be.bignumber.equal("1");
      });
      it("description", async function() {
        expect(this.metaData.description_).to.equal(TEST_DATA.description);
      });
      it("owner", async function() {
        expect(this.metaData.owner_).to.equal(alice);
      });
      it("pixels", async function() {
        for(const i in TEST_INPUT.pixels) {
          expect(this.metaData.pixels_[i]).to.be.bignumber.equal(String(TEST_INPUT.pixels[i]));
        }
      });
      it("default palette", async function() {
        for(const i in TEST_INPUT.palette) {
          expect(this.metaData.defaultPalette_[i]).to.be.bignumber.equal(String(TEST_INPUT.palette[i]));
        }
      });
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

      it("should generate a correct SVG image with the original palette", async function() {
        const svg = fs.readFileSync(`${__dirname}/fixtures/test-svg.svg`, 'utf8');
        expect(await this.collection.generateSVG(0)).to.equal(svg);
      });

      // Other NFT tests will be done on DixelClubV2NFT.test.js
    });
  }); // create a collection

  describe("getCollections", function() {
    beforeEach(async function() {
      await this.factory.createCollection(...this.testParams);
      await this.factory.createCollection(...this.testParams);
      await this.factory.createCollection(...this.testParams);
      this.collection0 = await DixelClubV2NFT.at(await this.factory.collections("0"));
      this.collection1 = await DixelClubV2NFT.at(await this.factory.collections("1"));
      this.collection2 = await DixelClubV2NFT.at(await this.factory.collections("2"));
    });

    it("should return all results", async function() {
      const list = await this.factory.getCollections(0, 100);
      expect(list).to.deep.equal([this.collection0.address, this.collection1.address, this.collection2.address]);
    });

    it("should return correct paginated results", async function() {
      const list = await this.factory.getCollections(0, 2);
      expect(list).to.deep.equal([this.collection0.address, this.collection1.address]);
    });
  });
}); // DixelClubV2Factory
