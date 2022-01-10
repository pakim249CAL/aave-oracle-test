// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import "../interfaces/AggregatorV2V3Interface.sol";

contract MockOracle is AggregatorV2V3Interface {
  uint8 public override decimals;
  int256 private price;

  function latestAnswer() external view override returns (int256) {
    return price;
  }
  function latestTimestamp() external view override returns (uint256) {
    return block.timestamp;
  }
  function latestRound() external view override returns (uint256) {
    return 0;
  }
  function getAnswer(uint256 roundId) external view override returns (int256) {
    return price;
  }
  function getTimestamp(uint256 roundId) external view override returns (uint256) {
    return block.timestamp;
  }

  constructor(uint8 decimals_, int256 price_) public {
    decimals = decimals_;
    price = price_;
  }

  function getRoundData(uint80 _roundId) external view override returns (
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  ) 
  {
    return (_roundId, price, 0, 0, 0);
  }

  function latestRoundData() external view override returns (
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
  ) 
  {
    return (0, price, 0, 0, 0);
  }
}