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
import "hardhat-gas-reporter";

import { 
} from "../helpers/types";
import {
} from "../helpers/helpers";


describe("Proposal Test", function () {

  let signer: Signer;
  let aaveOracle: Contract;
  before(async function() {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7"],
      });  
    signer = await hre.ethers.getSigner("0x26a78D5b6d7a7acEEDD1e6eE3229b372A624d8b7");
    const AaveOracle: ContractFactory = await hre.ethers.getContractFactory("AaveOracle");
    aaveOracle = await AaveOracle.deploy();
    
  });

  it("Should put up the proposal and trigger state sender", async function() {
    

  });
});