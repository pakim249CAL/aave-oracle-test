import { 
  BigNumber,
  Contract,
  Signer,
} from "ethers";
import * as hre from "hardhat";
import * as ethers from "ethers";
import {
  Oracle,
  OracleInput,
  oracleInputs,
  oldAaveOracleAddress,
  ETHER,
} from "./types";

export function checkDivergence(
  a: BigNumber,
  b: BigNumber,
  warningThreshold: number = 2,
  cutoffThreshold: number = 5,
) {
  const diff = a.sub(b).abs();
  const percent = diff.mul(100).div(a);
  if (percent.abs().gt(cutoffThreshold)) {
    return false;
  }
  if (percent.abs().gt(warningThreshold)) {
    console.log(
      `WARNING: ${a.toString()} is ${percent.toString()}% different from ${b.toString()}`,
    );
  }
  return true;
}

export async function getOldOracleContract(
  asset: string,
  feedAddress: string,
) {
  const AaveOracle = await hre.ethers.getContractFactory("AaveOracle");
  const AggregatorV2V3Interface = await hre.ethers.getContractFactory("AggregatorV2V3Interface");
  const aaveOracle = await AaveOracle.attach(feedAddress);
  const oldOracleAddress = await aaveOracle.getSourceOfAsset(asset);
  const oldOracle = await AggregatorV2V3Interface.attach(oldOracleAddress);
  return oldOracle;
}

/* Using oracle inputs, builds an oracle object to facilitate testing.
 * The feed address of the old oracle is queried for the old price source. */
export async function buildOracleObject(
  oracleInput_: OracleInput,
  feedAddress_: string = oldAaveOracleAddress,
) {
  const AaveOracle = await hre.ethers.getContractFactory("AaveOracle");
  const aaveOracle = await AaveOracle.attach(feedAddress_);
  let oldOracle: Contract;
  if(oracleInput_.oldOracle == '') {
    const oldOracleAddress = await aaveOracle.getSourceOfAsset(oracleInput_.asset);
    oldOracle = await hre.ethers.getContractAt("AggregatorV2V3Interface", oldOracleAddress);
  }
  else if(oracleInput_.oldOracle == 'ETH') {
    const mockOracle = await deployMockOracle(BigNumber.from("18"), ETHER);
    await mockOracle.deployed();
    oldOracle = await hre.ethers.getContractAt("AggregatorV2V3Interface", mockOracle.address);
  }
  else {
    oldOracle = await hre.ethers.getContractAt("AggregatorV2V3Interface", oracleInput_.oldOracle);
  }
  const newOracle = await hre.ethers.getContractAt("AggregatorV2V3Interface", oracleInput_.newOracle);
  return new Oracle(oracleInput_.assetName, oracleInput_.asset, newOracle, oldOracle);
}

export async function buildOracleObjects(
  oracleInputs_: OracleInput[] = oracleInputs,
  feedAddress_: string = oldAaveOracleAddress,
) {
  const oracles: Oracle[] = [];
  for (const oracleInput of oracleInputs_) {
    const oracle = await buildOracleObject(oracleInput, feedAddress_);
    oracles.push(oracle);
  }
  return oracles;
}

export async function deployMockOracle(
  decimals: BigNumber,
  price: BigNumber,
) {
  const MockOracle = await hre.ethers.getContractFactory("MockOracle");
  const mockOracle = await MockOracle.deploy(decimals, price);
  return mockOracle;
}

export async function deployNewAaveOracle(
  signer: Signer,
  assets: string[],
  sources: string[],
  fallBackOracle: string = ethers.constants.AddressZero,
  baseCurrency: string = ethers.constants.AddressZero,
  baseCurrencyUnit: BigNumber = BigNumber.from(100_000_000), // 1e8
) {
  const AaveOracle = await hre.ethers.getContractFactory("AaveOracle");
  const aaveOracle = await AaveOracle.connect(signer).deploy(
    assets,
    sources,
    fallBackOracle,
    baseCurrency,
    baseCurrencyUnit,
  )
  await aaveOracle.deployed();
  return aaveOracle;
}

export async function getEthPrice(
  oracleAddress: string = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
) {
  const oracle = await hre.ethers.getContractAt("AggregatorV2V3Interface", oracleAddress);
  return (await oracle.latestAnswer());
}