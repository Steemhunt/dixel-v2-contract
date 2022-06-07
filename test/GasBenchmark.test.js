const { ether } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const DixelClubV2Factory = artifacts.require("DixelClubV2Factory");
const DixelClubV2NFTMock = artifacts.require("DixelClubV2NFTMock");

const { createCollection, generateRandomAddresses } = require("./helpers/DataHelpers");

/**
·--------------------------------------------------------|---------------------------|--------------|-----------------------------·
|                  Solc version: 0.8.13                  ·  Optimizer enabled: true  ·  Runs: 1500  ·  Block limit: 60000000 gas  │
·························································|···························|··············|······························
|  Methods                                               ·               25 gwei/gas                ·       1802.97 usd/eth       │
·······················|·································|·············|·············|··············|···············|··············
|  Contract            ·  Method                         ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
·······················|·································|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  createCollection               ·    1233465  ·    1258465  ·     1236590  ·            8  ·      55.74  │
·······················|·································|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  addWhitelist                   ·   11586227  ·   11586239  ·    11586233  ·            2  ·     522.24  │
·······················|·································|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  removeWhitelist                ·      35563  ·      40363  ·       38763  ·            3  ·       1.75  │
·······················|·································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock  ·  addWhitelist_CustomMap         ·   34074902  ·   34074974  ·    34074938  ·            2  ·    1535.90  │
·······················|·································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock  ·  addWhitelist_EnumerableMap     ·   33978589  ·   33978685  ·    33978637  ·            2  ·    1531.56  │
·······················|·································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock  ·  addWhitelist_SimpleArray       ·   11621131  ·   11621203  ·    11621167  ·            2  ·     523.82  │
·······················|·································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock  ·  removeWhitelist_CustomMap      ·          -  ·          -  ·       72693  ·            1  ·       3.28  │
·······················|·································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock  ·  removeWhitelist_EnumerableMap  ·          -  ·          -  ·       40983  ·            1  ·       1.85  │
·······················|·································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock  ·  removeWhitelist_SimpleArray    ·          -  ·          -  ·     1036394  ·            1  ·      46.71  │
·······················|·································|·············|·············|··············|···············|··············
|  Deployments                                           ·                                          ·  % of limit   ·             │
·························································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                                    ·    1080921  ·    1080933  ·     1080930  ·        1.8 %  ·      48.72  │
·························································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock                                    ·          -  ·          -  ·     5159259  ·        8.6 %  ·     232.55  │
·--------------------------------------------------------|-------------|-------------|--------------|---------------|-------------·
**/

contract.skip("Gas Benchmark", function(accounts) {
  const [ deployer, alice, bob, carol ] = accounts;

  beforeEach(async function() {
    this.impl = await DixelClubV2NFTMock.new();
    this.factory = await DixelClubV2Factory.new(this.impl.address);
    this.collection = await createCollection(this.factory, DixelClubV2NFTMock, deployer, { whitelistOnly: true });
    this.addresses = generateRandomAddresses(500);
  });

  describe("current implementation", function () {
    beforeEach(async function() {
      await this.collection.addWhitelist(this.addresses);
    });

    it("should be added", async function() {
      expect(await this.collection.getWhitelistCount()).to.be.bignumber.equal("500");
    });

    it("can be removed using index", async function() {
      await this.collection.removeWhitelist(499, this.addresses[499]);
      await this.collection.removeWhitelist(300, this.addresses[300]);
      await this.collection.removeWhitelist(200, this.addresses[200]);
      expect(await this.collection.getWhitelistCount()).to.be.bignumber.equal("497");
    })
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
