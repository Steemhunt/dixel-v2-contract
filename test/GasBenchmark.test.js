const { ether } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const DixelClubV2Factory = artifacts.require("DixelClubV2Factory");
const DixelClubV2NFTMock = artifacts.require("DixelClubV2NFTMock");

const { createCollection, generateRandomAddresses } = require("./helpers/DataHelpers");

contract("Gas Benchmark", function(accounts) {
  const [ deployer, alice, bob, carol ] = accounts;

  beforeEach(async function() {
    this.impl = await DixelClubV2NFTMock.new();
    this.factory = await DixelClubV2Factory.new(this.impl.address);
    this.collection = await createCollection(this.factory, DixelClubV2NFTMock, deployer, { whitelistOnly: true });
    this.addresses = generateRandomAddresses(500);
  });

  describe("simple array", function () {
    beforeEach(async function() {
      await this.collection.addWhitelist_SimpleArray(this.addresses);
    });

    it("should be added", async function() {
      expect(await this.collection.getWhitelistCount_SimpleArray()).to.be.bignumber.equal("500");
    });

    it("can be removed", async function() {
      await this.collection.removeWhitelist_SimpleArray([this.addresses[200], this.addresses[300], this.addresses[499]]);
      expect(await this.collection.getWhitelistCount_SimpleArray()).to.be.bignumber.equal("497");
    });

    it("can be removed using index", async function() {
      await this.collection.removeWhitelist_SimpleArray_ByIndex(499);
      await this.collection.removeWhitelist_SimpleArray_ByIndex(300);
      await this.collection.removeWhitelist_SimpleArray_ByIndex(200);
      expect(await this.collection.getWhitelistCount_SimpleArray()).to.be.bignumber.equal("497");
    })
  });

  describe("enumerable map", function () {
    beforeEach(async function() {
      await this.collection.addWhitelist_EnumerableMap(this.addresses);
    });

    it("should be added", async function() {
      expect(await this.collection.getWhitelistCount_EnumerableMap()).to.be.bignumber.equal("500");
    });

    it("can be removed", async function() {
      await this.collection.removeWhitelist_EnumerableMap([this.addresses[200], this.addresses[300], this.addresses[499]]);
      expect(await this.collection.getWhitelistCount_EnumerableMap()).to.be.bignumber.equal("497");
    });
  });

  describe("custom map by @Nipol", function () {
    beforeEach(async function() {
      await this.collection.addWhitelist_CustomMap(this.addresses);
    });

    it("should be added", async function() {
      expect(await this.collection.getWhitelistCount_CustomMap()).to.be.bignumber.equal("500");
    });

    it("can be removed", async function() {
      await this.collection.removeWhitelist_CustomMap([this.addresses[200], this.addresses[300], this.addresses[499]]);
      expect(await this.collection.getWhitelistCount_CustomMap()).to.be.bignumber.equal("497");
    });
  });
});
