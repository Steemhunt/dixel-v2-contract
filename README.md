# Dixel Club V2

Pixel Art NFT factory that users can:
1. Creators: Create a new NFT collection with a 24x24 pixel art canvas with following parameters
    - name
    - symbol
    - description
    - max minting supply (1 - 1,000,000)
    - minting cost - in native currency (ETH, BNB, KLAY) (95% goes to creator / 5% platform fee)
    - royalty (receiving address, percentage: 0 - 10%)
    - minting initiation time (unix timestamp)
    - whitelistOnly (boolean)
      - whitelist can be added by the creator later (wallet address, minting allowance)
2. Collectors: Mint a new edition on an existing collection with color variations

## Run Tests
```bash
npx hardhat test
```

## Contracts

### Ethereum Testnet (Goerli)
- Test DIXEL token: 0x6D96ECf4E598dd4FeC0c4CBB3862E3bCcf28A144
- DixelClubV2Factory: 0x5663A199Fae99639d80282cbb6Ff751c6Cff6F01
- DixelClubV2NFT: 0x312e3AC6297baf2671eaBaCC015c36dEFf7eE79d

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