# Dixel Club V2

Pixel Art NFT factory that users can:
1. Create a new NFT collection with a 24x24 pixel art canvas
2. Mint a new edition on an existing collection with color variations (traits)

## Run Tests
```bash
npx hardhat test
```

## Contracts

### Ethereum Testnet

### Klaytn Testnet

### BSC Testnet

## Deploy
```bash
npx hardhat compile

HARDHAT_NETWORK=bscmain node scripts/deploy.js

# Verify source code on Etherscan
npx hardhat verify --network bscmain {contract address} "parameter 1" "parameter 2"
```

## Gas Consumption
```
·-------------------------------------------|---------------------------|--------------|-----------------------------·
|           Solc version: 0.8.13            ·  Optimizer enabled: true  ·  Runs: 1500  ·  Block limit: 60000000 gas  │
············································|···························|··············|······························
|  Methods                                  ·               50 gwei/gas                ·       2445.34 usd/eth       │
·······················|····················|·············|·············|··············|···············|··············
|  Contract            ·  Method            ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
·······················|····················|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  createCollection  ·    1314765  ·    1334737  ·     1333489  ·           16  ·     163.04  │
·······················|····················|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mint              ·     196754  ·     253298  ·      226513  ·           11  ·      27.70  │
·······················|····················|·············|·············|··············|···············|··············
|  Deployments                              ·                                          ·  % of limit   ·             │
············································|·············|·············|··············|···············|··············
|  ColorUtilsMock                           ·          -  ·          -  ·      298893  ·        0.5 %  ·      36.54  │
············································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                       ·          -  ·          -  ·     4132897  ·        6.9 %  ·     505.32  │
·-------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```