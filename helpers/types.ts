import { BigNumber } from "ethers";

export class Oracle {
  assetName: string;
  asset: string;
  oracle: string;

  constructor(
    assetName: string = '',
    asset: string = '',
    oracle: string = '',
  ) {
    this.asset = asset;
    this.oracle = oracle;
    this.assetName = assetName;
  }
}

export class Oracles {
  oracles: Oracle[];

  constructor(oracles: Oracle[]) {
    this.oracles = oracles;
  }

  getOracle(assetName: string) {
    return this.oracles.find(o => o.assetName === assetName);
  }

  get payload() {
    return [this.oracles.map(o => o.asset), this.oracles.map(o => o.oracle)]
  }
}

export const oracles:Oracles = new Oracles([
  new Oracle("AAVE", "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9", "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9"),
  new Oracle("AMPL", "0xd46ba6d942050d489dbd938a2c909a5d5039a161", "0xe20CA8D7546932360e37E9D72c1a47334af57706"),
  //new Oracle("BAL", "0xba100000625a3754423978a60c9317c58a424e3d", ""),
  new Oracle("BAT", "0x0d8775f648430679a709e98d2b0cb6250d2887ef", "0x9441D7556e7820B5ca42082cfa99487D56AcA958"),
  new Oracle("BUSD", "0x4fabb145d64652a948d72533023f6e7a623c7c53", "0x833D8Eb16D306ed1FbB5D7A2E019e106B960965A"),
  new Oracle("CRV", "0xD533a949740bb3306d119CC777fa900bA034cd52", "0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f"),
  new Oracle("DAI", "0x6b175474e89094c44da98b954eedeac495271d0f", "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9"),
  new Oracle("DPI", "0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b", "0xD2A593BF7594aCE1faD597adb697b5645d5edDB2"),
  //new Oracle("ENJ", "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c", ""),
  new Oracle("ETH", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"),
  new Oracle("FEI", "0x956F47F50A910163D8BF957Cf5846D573E7f87CA", "0x31e0a88fecB6eC0a411DBe0e9E76391498296EE9"),
  new Oracle("FRAX", "0x853d955acef822db058eb8505911ed77f175b99e", "0x61eB091ea16A32ea5B880d0b3D09d518c340D750"),
  new Oracle("GUSD", "0x056fd409e1d7a124bd7017459dfea2f387b6d5cd", "0xa89f5d2365ce98B3cD68012b6f503ab1416245Fc"),
  new Oracle("KNC", "0xdd974d5c2e2928dea5f71b9825b8b646686bd200", "0xf8fF43E991A81e6eC886a3D281A2C6cC19aE70Fc"),
  new Oracle("LINK", "0x514910771af9ca656af840dff83e8264ecf986ca", "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c"),
  //new Oracle("MANA", "0x0f5d2fb29fb7d3cfee444a200298f468908cc942", ""),
  new Oracle("MKR", "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2", "0xec1D1B3b0443256cc3860e24a46F108e699484Aa"),
  new Oracle("RAI", "0x03ab458634910aad20ef5f1c8ee96f1d6ac54919", "0x483d36F6a1d063d580c7a24F9A42B346f3a69fbb"),
  new Oracle("REN", "0x408e41876cccdc0f92210600ef50372656052a38", "0x0f59666EDE214281e956cb3b2D0d69415AfF4A01"),
  new Oracle("renFIL", "0xd5147bc8e386d91cc5dbe72099dac6c9b99276f5", "0x1A31D42149e82Eb99777f903C08A2E41A00085d3"),
  new Oracle("SNX", "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f", "0xDC3EA94CD0AC27d9A86C180091e7f78C683d3699"),
  new Oracle("SUSD", "0x57ab1ec28d129707052df4df418d58a2d46d5f51", "0x1187272A0E3A603eC4734CeC73a0880055eCC593"),
  //new Oracle("TUSD", "0x0000000000085d4780b73119b644ae5ecd22b376", ""),
  new Oracle("UNI", "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", "0x553303d460EE0afB37EdFf9bE42922D8FF63220e"),
  new Oracle("USDC", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6"),
  new Oracle("USDP", "0x8e870d67f660d95d5be530380d0ec0bd388289e1", "0x09023c0DA49Aaf8fc3fA3ADF34C6A7016D38D5e3"),
  new Oracle("USDT", "0xdac17f958d2ee523a2206206994597c13d831ec7", "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D"),
  new Oracle("WBTC", "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c"),
  //new Oracle("xSUSHI", "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272", ""),
  new Oracle("YFI", "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", "0xA027702dbb89fbd58938e4324ac03B58d812b0E1"),
  new Oracle("ZRX", "0xe41d2489571d322189246dafa5ebde1f4699f498", "0x2885d15b8Af22648b98B122b22FDF4D2a56c6023"),
]);