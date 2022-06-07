const { ether, balance, time, BN, constants, expectEvent, expectRevert, send } = require("@openzeppelin/test-helpers");
const { MAX_UINT256, ZERO_ADDRESS } = constants;
const { expect } = require("chai");
const fs = require("fs");

const DixelClubV2Factory = artifacts.require("DixelClubV2Factory");
const DixelClubV2NFT = artifacts.require("DixelClubV2NFT");

const { TEST_INPUT, TEST_DATA, createCollection } = require("./helpers/DataHelpers");

contract("DixelClubV2NFT", function(accounts) {
  const [ deployer, alice, bob, carol ] = accounts;

  beforeEach(async function() {
    this.impl = await DixelClubV2NFT.new();
    this.factory = await DixelClubV2Factory.new(this.impl.address);
    this.mintingCost = TEST_DATA.metaData.mintingCost;
  });

  describe("edge cases", function() {
    it("should be revert to send native currency with nothing", async function() {
      await expectRevert.unspecified(send.ether(deployer, this.impl.address, "1"));
    });

    it("can mint a new edition for free if minting cost is 0", async function() {
      const collection = await createCollection(this.factory, DixelClubV2NFT, alice, { mintingCost: 0 });

      const tracker = await balance.tracker(bob, 'wei');
      await collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob });
      const { delta, fees } = await tracker.deltaWithFees();

      expect(delta.add(fees)).to.be.bignumber.equal("0");
    });

    it("cannot initialize again", async function () {
      const collection = await createCollection(this.factory, DixelClubV2NFT);

      await expectRevert(
        collection.init(alice, TEST_DATA.name, TEST_DATA.symbol, TEST_DATA.description, Object.values(TEST_DATA.metaData), TEST_INPUT.palette, TEST_INPUT.pixels),
        "DixelClubV2__Initalized"
      );
    });

    it("cannot mint over maxSupply", async function() {
      // Edition #0 is already minted on createCollection
      const collection = await createCollection(this.factory, DixelClubV2NFT, alice, { maxSupply: 3, mintingCost: 0 }); // count: 1
      await collection.mintPublic(alice, TEST_INPUT.palette2, { from: alice }); // count: 2
      await collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob }); // count: 3

      await expectRevert(
        collection.mintPublic(carol, TEST_INPUT.palette2, { from: carol }),
        "DixelClubV2__MaximumMinted"
      );
    });

    it("cannot mint (maxSupply - 1)th edition even if someone burned a token", async function() {
      const collection = await createCollection(this.factory, DixelClubV2NFT, alice, { maxSupply: 2, mintingCost: 0 }); // edition: 0
      await collection.mintPublic(alice, TEST_INPUT.palette2, { from: alice }); // edition: 1

      await collection.burn("1", { from: alice });

      expect(await collection.totalSupply()).to.be.bignumber.equal("1");
      await expectRevert(
        collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob }),
        "DixelClubV2__MaximumMinted"
      );
    });

    it("cannot mint before mintingBeginsFrom", async function() {
      const now = parseInt((new Date()).getTime() / 1000);
      const collection = await createCollection(this.factory, DixelClubV2NFT, alice, { mintingCost: 0, mintingBeginsFrom: now + 1000 });

      await expectRevert(
        collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob }),
        "DixelClubV2__NotStarted"
      );
    });
  }); // edge cases

  describe("minting a new edition", function() {
    beforeEach(async function() {
      this.collection = await createCollection(this.factory, DixelClubV2NFT, alice);
      this.mintingFee = this.mintingCost.mul(await this.factory.mintingFee()).div(await this.factory.FRICTION_BASE());
    });

    it("should revert if sending an invalid minting fee", async function() {
      await expectRevert(this.collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob }), "DixelClubV2__InvalidCost");
      await expectRevert(this.collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob, value: ether("0.9") }), "DixelClubV2__InvalidCost");
    })

    it("should deduct minting cost from bob", async function() {
      const tracker = await balance.tracker(bob, 'wei');
      await this.collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
      const { delta, fees } = await tracker.deltaWithFees();

      expect(delta.mul(new BN(-1)).sub(fees)).to.be.bignumber.equal(this.mintingCost);
    });

    it("should send minting cost to the collection owner (alice) after deducting minting fee", async function() {
      const tracker = await balance.tracker(alice, 'wei');
      await this.collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
      const delta = await tracker.delta();

      expect(delta).to.be.bignumber.equal(this.mintingCost.sub(this.mintingFee));
    });

    it("should send minting fee to the beneficiary", async function() {
      const tracker = await balance.tracker(await this.factory.beneficiary(), 'wei');
      await this.collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
      const delta = await tracker.delta();

      expect(delta).to.be.bignumber.equal(this.mintingFee);
    });

    it("should have correct royalty info", async function() {
      const info = await this.collection.royaltyInfo("0", "100");

      expect(info[0]).to.equal(alice); // collection creator
      expect(info[1]).to.be.bignumber.equal("5"); // 5%
    });

    describe("generate SVG and base64 encoded image", function() {
      beforeEach(async function() {
        await this.collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
        this.svg = fs.readFileSync(`${__dirname}/fixtures/test-svg2.svg`, 'utf8');
        this.base64Image = `data:image/svg+xml;base64,${Buffer.from(this.svg).toString('base64')}`;
      });

      it("new SVG image for the new edition", async function() {
        expect(await this.collection.generateSVG(1)).to.equal(this.svg);
      });

      it("base64 encoded SVG image correctly", async function() {
        expect(await this.collection.generateBase64SVG(1)).to.equal(this.base64Image);
      });

      it("Generate SVG with Not Existance token", async function() {
        await expectRevert(this.collection.generateSVG(2), 'DixelClubV2__NotExist');
      });

      it("Generate base64 encoded SVG with Not Existance token", async function() {
        await expectRevert(this.collection.generateBase64SVG(2), 'DixelClubV2__NotExist');
      });

      describe("generate tokenJSON and URI", function() {
        beforeEach(async function() {
          // NOTE: block.chainid returns 0 on hardhat network for some reason. We should check if it returns a correct value on mainnets.
          this.json = `{"name":"${TEST_DATA.symbol} #1","description":"${TEST_DATA.description}",` +
            `"external_url":"https://dixel.club/collection/0/${this.collection.address.toLowerCase()}/1","image":"${this.base64Image}"}`;
        });

        it("tokenJSON", async function() {
          expect(await this.collection.tokenJSON(1)).to.equal(this.json);
        });

        it("tokenURI", async function() {
          expect(await this.collection.tokenURI(1)).to.equal(`data:application/json;base64,${Buffer.from(this.json).toString('base64')}`);
        });

        it("Not Existance token for tokenURI", async function() {
          await expectRevert(this.collection.tokenURI(2), 'DixelClubV2__NotExist');
        });

        it("Not Existance token for tokenJSON", async function() {
          await expectRevert(this.collection.tokenJSON(2), 'DixelClubV2__NotExist');
        });
      });
    });

    describe("generate contract level metadata", function() {
      beforeEach(async function() {
        // NOTE: block.chainid returns 0 on hardhat network for some reason. We should check if it returns a correct value on mainnets.
        const token0SVG = `data:image/svg+xml;base64,${Buffer.from(fs.readFileSync(`${__dirname}/fixtures/test-svg.svg`, 'utf8')).toString('base64')}`;
        this.json = `{"name":"${TEST_DATA.name}","description":"${TEST_DATA.description}",` +
          `"image":"${token0SVG}","external_link":"https://dixel.club/collection/0/${this.collection.address.toLowerCase()}",` +
          `"seller_fee_basis_points":"${TEST_DATA.metaData.royaltyFriction}","fee_recipient":"${alice.toLowerCase()}"}`;
      });

      it("contractJSON", async function() {
        expect(await this.collection.contractJSON()).to.equal(this.json);
      });

      it("contractURI", async function() {
        const base64 = `data:application/json;base64,${Buffer.from(this.json).toString('base64')}`;
        expect(await this.collection.contractURI()).to.equal(base64);
      });
    });
  }); // mintingn a new edition

  describe("burn", function() {
    beforeEach(async function() {
      this.collection = await createCollection(this.factory, DixelClubV2NFT, alice);
      await this.collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost }); // mint #1
    });

    it("initial states", async function() {
      expect(await this.collection.exists("1")).to.equal(true);
      expect(await this.collection.totalSupply()).to.be.bignumber.equal("2");
    });

    describe("owner can burn their NFT", function() {
      beforeEach(async function() {
        await this.collection.burn("1", { from: bob });
      });

      it("should delete the token", async function() {
        expect(await this.collection.exists("1")).to.equal(false);
      });

      it("should decrease the totalSupply", async function() {
        expect(await this.collection.totalSupply()).to.be.bignumber.equal("1");
      });

      it("should leave the nextTokenId() with the empty edition number", async function() {
        expect(await this.collection.nextTokenId()).to.be.bignumber.equal("2");
      });
    });

    describe("edge cases", function() {
      it("should prevent non-owner to burn token", async function() {
        await expectRevert(
          this.collection.burn("1", { from: carol }),
          "DixelClubV2__NotApproved"
        );
      });

      it("should allow non-owner to burn token once approved", async function() {
        await this.collection.approve(carol, "1", { from: bob });
        await this.collection.burn("1", { from: carol });
        expect(await this.collection.exists("1")).to.equal(false);
      });

      it("should allow non-owner to burn token once setApprovalForAll", async function() {
        await this.collection.setApprovalForAll(carol, true, { from: bob });
        await this.collection.mintPublic(bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost }); // mint #2
        expect(await this.collection.totalSupply()).to.be.bignumber.equal("3");

        await this.collection.burn("1", { from: carol });
        await this.collection.burn("2", { from: carol });

        expect(await this.collection.exists("1")).to.equal(false);
        expect(await this.collection.exists("2")).to.equal(false);
        expect(await this.collection.totalSupply()).to.be.bignumber.equal("1");
      });
    });
  }); // burn

  describe("whitelist", function() {
    beforeEach(async function() {
      this.collection = await createCollection(this.factory, DixelClubV2NFT, alice, { whitelistOnly: true });
      await this.collection.addWhitelist([alice, bob], { from: alice });
    });

    describe("initial states", function() {
      it("should have 2 whitelist count", async function() {
        expect(await this.collection.getWhitelistCount()).to.be.bignumber.equal("2");
      });

      it("should have alice in whitelist", async function() {
        expect(await this.collection.getWhitelistIndex(alice)).to.be.bignumber.equal("0");
        expect(await this.collection.getWhitelistAllowanceLeft(alice)).to.be.bignumber.equal("1");
      });

      it("should have bob in whitelist", async function() {
        expect(await this.collection.getWhitelistIndex(bob)).to.be.bignumber.equal("1");
        expect(await this.collection.getWhitelistAllowanceLeft(bob)).to.be.bignumber.equal("1");
      });

      it("should return all whitelist correctly", async function() {
        const list = await this.collection.getAllWhitelist("0", "2");
        expect(list[0]).to.equal(alice);
        expect(list[1]).to.equal(bob);
      });
    }); // initial states


    describe("pagination", async function() {
      beforeEach(async function() {
        await this.collection.addWhitelist([carol, alice, bob, carol, carol, alice, bob, bob], { from: alice });
        // total 10: a, b, c, a, b, c, c, a, b, b
      });

      it("should paginate correctly with offset and limit", async function() {
        const list = await this.collection.getAllWhitelist("2", "3");
        expect(list.length).to.equal(3);
        expect(list[0]).to.equal(carol);
        expect(list[1]).to.equal(alice);
        expect(list[2]).to.equal(bob);
      });

      it("should return empty array if offset >= length", async function() {
        const list = await this.collection.getAllWhitelist("10", "3");
        expect(list.length).to.equal(0);
      });

      it("should output all results up to the end of the array if offset + limit > whitelist length", async function() {
        const list = await this.collection.getAllWhitelist("8", "5");
        expect(list.length).to.equal(2);
        expect(list[0]).to.equal(bob);
        expect(list[1]).to.equal(bob);
      });
    }); // pagination

    describe("remove whitelist", function() {
      beforeEach(async function() {
        await this.collection.addWhitelist([carol, alice, bob], { from: alice }); // total 5: a, b, c, a, b
      });

      it("should remove a whitelist correctly", async function() {
        await this.collection.removeWhitelist(0, alice, { from: alice }); // b, b, c, a
        await this.collection.removeWhitelist(2, carol, { from: alice }); // b, b, a
        expect(await this.collection.getAllWhitelist("0", "100")).to.deep.equal([bob, bob, alice]);
      });

      it("should revert if index and value doesn't match", async function() {
        await expectRevert(
          this.collection.removeWhitelist(0, bob, { from: alice }),
          "DixelClubV2__WhiteListValueDoNotMatch"
        );
      });
    }); // remove whitelist

    describe("after minting", async function() {
      beforeEach(async function() {
        // whitelist: [alice, bob]
        await this.collection.mintPrivate(1, bob, TEST_INPUT.palette2, { from: bob, value: this.mintingCost });
      });

      it("should decrease the allowance after minting", async function() {
        expect(await this.collection.getWhitelistAllowanceLeft(bob)).to.be.bignumber.equal("0");
      });

      it("should return a correct whitelist left after 1 minting", async function() {
        expect(await this.collection.getWhitelistCount()).to.be.bignumber.equal("1");
      });
    }); // after minting

    describe("edge cases", async function() {
      it("addWhitelist can be only called by the owner of the collection", async function() {
        await expectRevert(
          this.collection.addWhitelist([bob], { from: bob }),
          "Ownable: caller is not the owner"
        );
      });

      it("removeWhitelist can be only called by the owner of the collection", async function() {
        await expectRevert(
          this.collection.removeWhitelist(1, bob, { from: bob }),
          "Ownable: caller is not the owner"
        );
      });

      it("should not allow using mintPublic method", async function() {
        await expectRevert(
          this.collection.mintPublic(carol, TEST_INPUT.palette2, { from: carol, value: this.mintingCost }),
          "DixelClubV2__PrivateCollection"
        );
      });

      it("should return duplicated results", async function() {
        await this.collection.addWhitelist([bob], { from: alice });

        const list = await this.collection.getAllWhitelist("0", "3");
        expect(list[0]).to.equal(alice);
        expect(list[1]).to.equal(bob);
        expect(list[2]).to.equal(bob);
      });

      it("should return a crrect allowance once duplicated", async function() {
        await this.collection.addWhitelist([alice, carol, alice], { from: alice });
        expect(await this.collection.getWhitelistAllowanceLeft(alice)).to.be.bignumber.equal("3");
      });

      it("addWhitelist cannot be called on public collection", async function() {
        const collection2 = await createCollection(this.factory, DixelClubV2NFT, alice);

        await expectRevert(
          collection2.addWhitelist([bob], { from: alice }),
          "DixelClubV2__PublicCollection"
        );
      });

      it("removeWhitelist cannot be called on public collection", async function() {
        const collection2 = await createCollection(this.factory, DixelClubV2NFT, alice);

        await expectRevert(
          collection2.removeWhitelist(1, bob, { from: alice }),
          "DixelClubV2__PublicCollection"
        );
      });
    }); // edge cases
  }); // whitelist

  describe("update metadata", function() {
    // MARK: - updateMetadata(bool whitelistOnly, bool hidden, uint24 royaltyFriction, uint40 mintingBeginsFrom, uint256 mintingCost)

    it("updates whitelistOnly", async function() {
      const collection = await createCollection(this.factory, DixelClubV2NFT, deployer, { whitelistOnly: true });
      await collection.addWhitelist([alice, bob]);
      expect(await collection.getWhitelistCount()).to.be.bignumber.equal("2"); // initial check

      await collection.updateMetadata(false, false, "500", (await collection.metaData()).mintingBeginsFrom_, "0");

      const metaData = await collection.metaData();
      expect(metaData.whitelistOnly_).to.equal(false);
      expect(await collection.getWhitelistCount()).to.be.bignumber.equal("0");
    });

    it("updates hidden status", async function() {
      const collection = await createCollection(this.factory, DixelClubV2NFT, deployer, { hidden: true });
      expect((await collection.listData()).hidden_).to.equal(true);

      await collection.updateMetadata(false, false, "500", (await collection.metaData()).mintingBeginsFrom_, "0");
      expect((await collection.listData()).hidden_).to.equal(false);
    });

    it("updates royaltyFriction", async function() {
      const collection = await createCollection(this.factory, DixelClubV2NFT, deployer, { royaltyFriction: "100" });
      expect((await collection.metaData()).royaltyFriction_).to.be.bignumber.equal("100");

      await collection.updateMetadata(false, false, "200", (await collection.metaData()).mintingBeginsFrom_, "0");
      expect((await collection.metaData()).royaltyFriction_).to.be.bignumber.equal("200");
    });

    it("updates mintingBeginsFrom", async function() {
      const later = (await time.latest()).add(new BN("1000"));
      const collection = await createCollection(this.factory, DixelClubV2NFT, deployer, { mintingBeginsFrom: later });
      expect((await collection.metaData()).mintingBeginsFrom_).to.be.bignumber.equal(later);

      const later2 = (await time.latest()).add(new BN("2000"));
      await collection.updateMetadata(false, false, "500", later2, "0");
      expect((await collection.metaData()).mintingBeginsFrom_).to.be.bignumber.equal(later2);
    });

    it("updates mintingBeginsFrom to the past value", async function() {
      const later = (await time.latest()).add(new BN("1000"));
      const collection = await createCollection(this.factory, DixelClubV2NFT, deployer, { mintingBeginsFrom: later });
      expect((await collection.metaData()).mintingBeginsFrom_).to.be.bignumber.equal(later);

      // fuzzy checking
      const now = await time.latest();
      await collection.updateMetadata(false, false, "500", now, "0");
      expect((await collection.metaData()).mintingBeginsFrom_).to.be.bignumber.gte(now);
      expect((await collection.metaData()).mintingBeginsFrom_).to.be.bignumber.lte(later);
    });

    it("updates mintingCost", async function() {
      const collection = await createCollection(this.factory, DixelClubV2NFT, deployer, { mintingCost: ether("2") });
      expect((await collection.metaData()).mintingCost_).to.be.bignumber.equal(ether("2"));

      await collection.updateMetadata(false, false, "200", (await collection.metaData()).mintingBeginsFrom_, ether("3"));
      expect((await collection.metaData()).mintingCost_).to.be.bignumber.equal(ether("3"));
    });

    // MARK: - updateDescription(string memory description)

    it("updates description", async function() {
      const collection = await createCollection(this.factory, DixelClubV2NFT, deployer, {}, "abcd");
      expect((await collection.metaData()).description_).to.equal("abcd");

      const newDescription = "ah ah whatever!!! 😉 hahah ha!";
      await collection.updateDescription(newDescription);
      expect((await collection.metaData()).description_).to.equal(newDescription);
    });

    describe("edge cases", function() {
      beforeEach(async function() {
        this.collection = await createCollection(this.factory, DixelClubV2NFT, alice);
      });

      it("should not allow non-owner can update metadata", async function() {
        await expectRevert(
          this.collection.updateMetadata(false, false, "500", (await this.collection.metaData()).mintingBeginsFrom_, ether("1"), { from: bob }),
          "Ownable: caller is not the owner"
        );
      });

      it("checks royalty friction range", async function () {
        const invalidValue = (await this.factory.MAX_ROYALTY_FRACTION()).add(new BN("1"));
        await expectRevert(
          this.collection.updateMetadata(false, false, invalidValue, (await this.collection.metaData()).mintingBeginsFrom_, ether("1"), { from: alice }),
          "DixelClubV2__InvalidRoyalty"
        );
      });

      it("checks if minting had already begun ", async function () {
        await expectRevert(
          this.collection.updateMetadata(false, false, "0", (await this.collection.metaData()).mintingBeginsFrom_.add(new BN("100")), ether("1"), { from: alice }),
          "DixelClubV2__AlreadyStarted"
        );
      });

      it("should check if description is over 1,000 characters", async function() {
        const longDescription = [...Array(1001)].map(() => Math.random().toString(36)[2]).join('');
        await expectRevert(this.collection.updateDescription(longDescription, { from: alice }), "DixelClubV2__DescriptionTooLong");
      });

      it("should check if description contains a quote", async function() {
        await expectRevert(this.collection.updateDescription('hello "', { from: alice }), "DixelClubV2__ContainMalicious");
      });
    }); // edge case
  }); // update metadata

  describe("more SVG tests", function() {
    it("generates successfully svg of more complex pixels", async function() {
      /*
        This more complex image adds the following checks to the basic "pixels" from TEST_INPUT:
          - Uses colors #14,15,16 of the pallete to make sure all pallete is used correctly
          - changes pixels(0,21)=13, pixels(0,22)=14, pixels(0,23)=15 - so 3 last pixels of first line should be different,
              set correctly, and we'll be able to see if line is correct width
          - pixels(23,22)=13, pixels(23,23)=13 - so last 2 pixels of image (bottom right corner) will be color #13
          - pixelsPacked[108]=14, pixelsPacked[420]=15 - just to make sure algorithm can handle random single pixels
          - pixels(23,0)=14 - bottom left corner should be colored
      */
      const collection = await createCollection(this.factory, DixelClubV2NFT, alice, {}, "", TEST_INPUT.pixels2);
      this.svg = fs.readFileSync(`${__dirname}/fixtures/test-svg-complex.svg`, 'utf8');

      expect(await collection.generateSVG(0)).to.equal(this.svg);
      });
    });
});
