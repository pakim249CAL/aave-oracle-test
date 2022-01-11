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
  shortExecutorAddress,
  lendingPoolAddressesProviderAddress,
} from "../helpers/types";
import {
  buildOracleObjects,
  deployNewAaveOracle,
  checkDivergence,
  getEthPrice,
  getWhales,
  getImpersonatedSigner,
  getWETH,
  getUniswapRouter,
} from "../helpers/helpers";


describe("Test oracles", function () {

  let shortExecutorSigner: Signer;
  let whales: Signer[] = [];
  let oracles: Oracle[]; 
  before(async function() {
    shortExecutorSigner = await getImpersonatedSigner(shortExecutorAddress);
    whales = await getWhales();
    oracles = await buildOracleObjects();
  });

  it("should have a price above 0 for all oracles.", async function() {
    for(let i = 0; i < oracles.length; i++) {
      expect(await oracles[i].oldOracle.latestAnswer()).to.be.gt(0);
      expect(await oracles[i].newOracle.latestAnswer()).to.be.gt(0);
    }
  });

  it("should have a price divergence of less than 5% when converting USD price feed to ETH (Warning if price diverges more than 2%)", async function() {
    for(let i = 0; i < oracles.length; i++) {
      const result = checkDivergence(
        await oracles[i].oldOracle.latestAnswer(), 
        (await oracles[i].newOracle.latestAnswer()).mul(ETHER).div(await getEthPrice())
      );
      expect(result).to.be.true;
    }
  }); 

  describe("Deploy new AaveOracle", function() {
    let newAaveOracle: Contract;
    let borrower: Signer = whales[0];

    before(async function() {
      newAaveOracle = await deployNewAaveOracle(
        shortExecutorSigner,
        oracles.map(o => o.asset),
        oracles.map(o => o.newOracle.address),
      );
    });

    it("should have a price above 0 for the new oracle.", async function() {
      for(let i = 0; i < oracles.length; i++) {
        expect(await newAaveOracle.getAssetPrice(oracles[i].asset)).to.be.gt(0);
      }
    });

    it("should have a price divergence of less than 5% when converting USD price feed to ETH (Warning if price diverges more than 2%)", async function() {
      for(let i = 0; i < oracles.length; i++) {
        const result = checkDivergence(
          await oracles[i].oldOracle.latestAnswer(),
          (await newAaveOracle.getAssetPrice(oracles[i].asset)).mul(ETHER).div(await getEthPrice())
        )
        expect(result).to.be.true;
      }
    }); 

    it("should change the oracle in the addresses provider", async function() {
      const lendingPoolAddressesProvider = await hre.ethers.getContractAt("ILendingPoolAddressesProvider", lendingPoolAddressesProviderAddress);
      await lendingPoolAddressesProvider.connect(shortExecutorSigner).setPriceOracle(newAaveOracle.address);
      expect(await lendingPoolAddressesProvider.getPriceOracle()).to.equal(newAaveOracle.address);
    }); 

    it("should not make health factors diverge by more than 5% (Warning if it diverges more than 2%)", async function() {
      /** 1. Get a decent list of user accounts that have borrow positions on aave
       *  2. Query the lending pool for the health factor for each user before and after the oracle changes in the addresses provider
       *  3. Check that the two health factors don't diverge
      */
      const weth = await getWETH(borrower);
      expect(await weth.balanceOf(await borrower.getAddress())).to.equal(ETHER.mul(100));
      const uniswapRouter = await getUniswapRouter();
      uniswapRouter.connect(borrower).swapExactTokensForTokens();
    });
  });

});