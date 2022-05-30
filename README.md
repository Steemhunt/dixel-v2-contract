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
- DixelClubV2Factory: [0xA0b8703F6ee2c9AEc8EEffF876B5DEA50d5E965f](https://goerli.etherscan.io/address/0xA0b8703F6ee2c9AEc8EEffF876B5DEA50d5E965f#code)
- DixelClubV2NFT (implementation contract): [0x02B5F17cF25E001685fe65dbF41AcBeA83aBE8D9](https://goerli.etherscan.io/address/0x02B5F17cF25E001685fe65dbF41AcBeA83aBE8D9#code)

### BSC Testnet
- DixelClubV2Factory: [0x9e42fF06758CBC6D1A9655a0AAC0EAeF0620e5e3](https://testnet.bscscan.com/address/0x9e42fF06758CBC6D1A9655a0AAC0EAeF0620e5e3#code)
- DixelClubV2NFT (implementation contract): [0x9f51103af760411b6f2B24e6a3df31bB45A3d9Dd](https://testnet.bscscan.com/address/0x9f51103af760411b6f2B24e6a3df31bB45A3d9Dd#code)

### Klaytn Testnet (Baobob)
- DixelClubV2Factory: 0x7a79df9480bd678bBf6F5B8F585a976894F53B64
- DixelClubV2NFT (implementation contract): 0xc2970094910a5D51d2ec6F6cB9426282C7bC61c4

## Deploy
```bash
npx hardhat compile

HARDHAT_NETWORK=bscmain node scripts/deploy.js

# Verify source code on Etherscan
npx hardhat verify --network bscmain {contract address} "parameter 1" "parameter 2"
```

## Gas Consumption
```
·----------------------------------------------------|---------------------------|--------------|-----------------------------·
|                Solc version: 0.8.13                ·  Optimizer enabled: true  ·  Runs: 1500  ·  Block limit: 60000000 gas  │
·····················································|···························|··············|······························
|  Methods                                           ·               25 gwei/gas                ·       1891.76 usd/eth       │
····························|························|·············|·············|··············|···············|··············
|  Contract                 ·  Method                ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  createCollection      ·    1338240  ·    1383212  ·     1356144  ·           76  ·      64.14  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateBeneficiary     ·          -  ·          -  ·       39442  ·            3  ·       1.87  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateImplementation  ·          -  ·          -  ·       28949  ·            3  ·       1.37  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  addWhitelist          ·      56929  ·     218934  ·      109648  ·           28  ·       5.19  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  mint                  ·     199311  ·     241196  ·      225504  ·           28  ·      10.66  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  removeWhitelist       ·      41299  ·      52040  ·       48410  ·            3  ·       2.29  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  setApprovalForAll     ·          -  ·          -  ·       48943  ·            1  ·       2.31  │
····························|························|·············|·············|··············|···············|··············
|  ERC20                    ·  approve               ·          -  ·          -  ·       51478  ·            1  ·       2.43  │
····························|························|·············|·············|··············|···············|··············
|  ERC20PresetMinterPauser  ·  burn                  ·      60311  ·      78207  ·       64081  ·            7  ·       3.03  │
····························|························|·············|·············|··············|···············|··············
|  Deployments                                       ·                                          ·  % of limit   ·             │
·····················································|·············|·············|··············|···············|··············
|  ColorUtilsMock                                    ·          -  ·          -  ·      298893  ·        0.5 %  ·      14.14  │
·····················································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                                ·          -  ·          -  ·     5483458  ·        9.1 %  ·     259.33  │
·····················································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock                                ·          -  ·          -  ·     4326076  ·        7.2 %  ·     204.60  │
·----------------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```
