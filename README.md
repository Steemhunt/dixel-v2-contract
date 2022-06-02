# Dixel Club V2

Pixel Art NFT factory that users can:
1. Creators: Create a new NFT collection with a 24x24 pixel art canvas with following parameters
    - name
    - symbol
    - description
    - max minting supply (1 - 1,000,000)
    - minting cost (in native currency: ETH, BNB, KLAY)
    - royalty (receiving address, percentage: 0 - 10%)
    - minting initiation time (unix timestamp)
    - whitelistOnly (boolean, whitelist can be added by the creator later)
    - hidden (boolean, hide the collection from the official main page listing)
2. Collectors: Mint a new edition on an existing collection with color variations

[🌏 Testnet Demo](https://v2testnet.dixel.club/) - Available on following testnets
- Ethereum Goerli ([Faucet](https://goerli-faucet.mudit.blog/))
- Klayten Baobao ([Faucet](https://baobab.wallet.klaytn.foundation/faucet))
- BNB Smart Chain ([Faucet](https://testnet.binance.org/faucet-smart))

## Community Audit
We are holding a community-based security audit with **$10,000 USDT bounty** and we're inviting all developer community!
If you're willing to participate, please read the instructions below:

[🛠 Community Audit Guide](https://github.com/Steemhunt/dixel-v2-contract/blob/main/COMMUNITY_AUDIT.md)

Contribution made by **12 June 2022** will be counted

## Run Tests
```bash
npx hardhat test
```

## Contracts

### Ethereum Testnet (Goerli)
- DixelClubV2Factory: [0xb58CF50D37c00902C5f07c8510fDF77C9325965B](https://goerli.etherscan.io/address/0xb58CF50D37c00902C5f07c8510fDF77C9325965B#code)
- DixelClubV2NFT (implementation contract): [0xAA9058D1D3AACB17a8f6100AA21C0C6d47ddA32E](https://goerli.etherscan.io/address/0xAA9058D1D3AACB17a8f6100AA21C0C6d47ddA32E#code)

### BSC Testnet
- DixelClubV2Factory: [0x310FdDF92cEfb7B151980748fa006B51756aAf6b](https://testnet.bscscan.com/address/0x310FdDF92cEfb7B151980748fa006B51756aAf6b#code)
- DixelClubV2NFT (implementation contract): [0x935818Fc9Cf9B47E2058a3038d19db2458D22107](https://testnet.bscscan.com/address/0x935818Fc9Cf9B47E2058a3038d19db2458D22107#code)

### Klaytn Testnet (Baobob)
- DixelClubV2Factory: 0xb9195a56Db279C50e3aAC7CC34950DD952aDcD79
- DixelClubV2NFT (implementation contract): 0xd5C2D8B72e316f882006E306bba1C15662266977

## Deploy
```bash
npx hardhat compile

HARDHAT_NETWORK=bscmain node scripts/deploy.js

# Verify source code on Etherscan
npx hardhat verify --network bscmain {contract address} "parameter 1" "parameter 2"
```

## Gas Consumption
```
·-----------------------------------------------|---------------------------|--------------|-----------------------------·
|             Solc version: 0.8.13              ·  Optimizer enabled: true  ·  Runs: 1500  ·  Block limit: 60000000 gas  │
················································|···························|··············|······························
|  Methods                                                                                                               │
·······················|························|·············|·············|··············|···············|··············
|  Contract            ·  Method                ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  createCollection      ·    1239125  ·    1284097  ·     1257262  ·           88  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateBeneficiary     ·          -  ·          -  ·       39442  ·            3  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateImplementation  ·          -  ·          -  ·       28949  ·            3  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  addWhitelist          ·      56678  ·     218172  ·      108841  ·           29  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  approve               ·          -  ·          -  ·       51478  ·            1  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  burn                  ·      60293  ·      78189  ·       64063  ·            7  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mint                  ·     197033  ·     238674  ·      223200  ·           28  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  removeWhitelist       ·      41062  ·      51253  ·       47621  ·            3  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  setApprovalForAll     ·          -  ·          -  ·       48943  ·            1  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateDescription     ·          -  ·          -  ·       61652  ·            1  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateMetadata        ·      35385  ·      42476  ·       37810  ·            5  ·          -  │
·······················|························|·············|·············|··············|···············|··············
|  Deployments                                  ·                                          ·  % of limit   ·             │
················································|·············|·············|··············|···············|··············
|  ColorUtilsMock                               ·          -  ·          -  ·      298893  ·        0.5 %  ·          -  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                           ·          -  ·          -  ·     5759540  ·        9.6 %  ·          -  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock                           ·          -  ·          -  ·     4590887  ·        7.7 %  ·          -  │
·-----------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```
