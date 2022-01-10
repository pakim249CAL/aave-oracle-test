import * as hre from "hardhat";
import { ethers } from "hardhat";
import { 
  Signer, 
  Contract,
  ContractFactory } from "ethers";
import { BigNumber } from "ethers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle";

import { 
  GWEI,
  ETHER,
  Oracle,
} from "../helpers/types";
import {
  buildOracleObjects,
  deployNewAaveOracle,
  checkDivergence,
  getEthPrice,
} from "../helpers/helpers";


describe("Test individual oracles", function () {

  let owner: Signer;
  let oracles: Oracle[]; 
  before(async function() {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7"],
      });  
    owner = await hre.ethers.getSigner("0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7");
    oracles = await buildOracleObjects();
  });

  it("Should have a price above 0 for all oracles.", async function() {
    for(let i = 0; i < oracles.length; i++) {
      expect(await oracles[i].oldOracle.latestAnswer()).to.be.gt(0);
      expect(await oracles[i].newOracle.latestAnswer()).to.be.gt(0);
    }
  });

  it("Should have a price divergence of less than 5% when converting USD price feed to ETH (Warning if price diverges more than 2%)", async function() {
    for(let i = 0; i < oracles.length; i++) {
      const result = checkDivergence(
        await oracles[i].oldOracle.latestAnswer(), 
        (await oracles[i].newOracle.latestAnswer()).mul(ETHER).div(await getEthPrice())
      );
      expect(result).to.be.true;
    }
  }); 

  describe("Deploy new AaveOracle and test", function() {
    let newAaveOracle: Contract;

    before(async function() {
      newAaveOracle = await deployNewAaveOracle(
        owner,
        oracles.map(o => o.asset),
        oracles.map(o => o.newOracle.address),
      );
      console.log(newAaveOracle.address)
    });

    it("Should have a price above 0 for the new oracle.", async function() {
      for(let i = 0; i < oracles.length; i++) {
        expect(await newAaveOracle.getAssetPrice(oracles[i].asset)).to.be.gt(0);
      }
    });

    it("Should have a price divergence of less than 5% when converting USD price feed to ETH (Warning if price diverges more than 2%)", async function() {
      for(let i = 0; i < oracles.length; i++) {
        const result = checkDivergence(
          await oracles[i].oldOracle.latestAnswer(),
          (await newAaveOracle.getAssetPrice(oracles[i].asset)).mul(ETHER).div(await getEthPrice())
        )
        expect(result).to.be.true;
      }
    }); 
  });

});