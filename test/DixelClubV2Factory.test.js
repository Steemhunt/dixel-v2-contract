const { ethers } = require('hardhat');
const { ether, BN, constants, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { MAX_UINT256, ZERO_ADDRESS } = constants;
const { expect } = require("chai");
const fs = require("fs");

const ERC20 = artifacts.require("ERC20PresetMinterPauser");
const DixelClubV2Factory = artifacts.require("DixelClubV2Factory");

contract("DixelClubV2Factory", function(accounts) {
  const [ deployer, alice ] = accounts;

  beforeEach(async function() {
    this.baseToken = await ERC20.new("Test Dixel", "TEST_PIXEL");
    await this.baseToken.mint(deployer, ether("10000"));

    this.factory = await DixelClubV2Factory.new(this.baseToken.address);
  });

  describe("initial status", function() {
    it("should have zero collections", async function() {
      expect(await this.factory.collectionCount()).to.be.bignumber.equal("0");
    });

    it("should initialize nft implementation contract", async function() {
      assert.notEqual(await this.factory.nftImplementation(), ZERO_ADDRESS);
    });
  });
});
