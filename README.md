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
- Ethereum Goerli ([Faucet](https://goerli-faucet.mudit.blog/), [Faucet2](https://faucet.paradigm.xyz/))
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
- DixelClubV2Factory: [0xDA2aE2aAFA6944D16296beD8652cFe909F2B4a15](https://goerli.etherscan.io/address/0xDA2aE2aAFA6944D16296beD8652cFe909F2B4a15#code)
- DixelClubV2NFT (implementation contract): [0xAcE7409436c6b464bE01c22Af967498822277CEF](https://goerli.etherscan.io/address/0xAcE7409436c6b464bE01c22Af967498822277CEF#code)

### BSC Testnet
- DixelClubV2Factory: [0xe413597C3e2DA25c9aE8a5CFdE36935f15727B52](https://testnet.bscscan.com/address/0xe413597C3e2DA25c9aE8a5CFdE36935f15727B52#code)
- DixelClubV2NFT (implementation contract): [0x8F43f02CF3fa43b58bCd5f85f091252d6Ab33361](https://testnet.bscscan.com/address/0x8F43f02CF3fa43b58bCd5f85f091252d6Ab33361#code)

### Klaytn Testnet (Baobob)
- DixelClubV2Factory: 0x3f2601B81318329Cff9513379F2B99448B9Edd2C
- DixelClubV2NFT (implementation contract): 0x06B217830A5213aC470eB9FFc00E19Ade5B088d1

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
|  Methods                                      ·               25 gwei/gas                ·       1792.57 usd/eth       │
·······················|························|·············|·············|··············|···············|··············
|  Contract            ·  Method                ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  createCollection      ·     832937  ·     877981  ·      851957  ·          100  ·      38.18  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateBeneficiary     ·          -  ·          -  ·       28965  ·            1  ·       1.30  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateCreationFee     ·          -  ·          -  ·       28707  ·            1  ·       1.29  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateImplementation  ·      28908  ·      28920  ·       28916  ·            3  ·       1.30  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateMintingFee      ·          -  ·          -  ·       28673  ·            1  ·       1.28  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  addWhitelist          ·      56650  ·     218123  ·      109236  ·           28  ·       4.90  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  approve               ·          -  ·          -  ·       51478  ·            1  ·       2.31  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  burn                  ·      45964  ·      50396  ·       47722  ·            7  ·       2.14  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mintPrivate           ·          -  ·          -  ·      164483  ·            2  ·       7.37  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mintPublic            ·     108921  ·     160425  ·      149810  ·           57  ·       6.71  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  removeWhitelist       ·      40351  ·      40363  ·       40357  ·            2  ·       1.81  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  resetWhitelist        ·          -  ·          -  ·       45193  ·            1  ·       2.03  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  setApprovalForAll     ·          -  ·          -  ·       48921  ·            1  ·       2.19  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateDescription     ·          -  ·          -  ·       62558  ·            1  ·       2.80  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateMetadata        ·      35535  ·      38756  ·       36140  ·            6  ·       1.62  │
·······················|························|·············|·············|··············|···············|··············
|  Deployments                                  ·                                          ·  % of limit   ·             │
················································|·············|·············|··············|···············|··············
|  ColorUtilsMock                               ·          -  ·          -  ·      298893  ·        0.5 %  ·      13.39  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                           ·    1162972  ·    1162984  ·     1162983  ·        1.9 %  ·      52.12  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2NFT                               ·          -  ·          -  ·     4580750  ·        7.6 %  ·     205.28  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock                           ·          -  ·          -  ·     5228384  ·        8.7 %  ·     234.31  │
·-----------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```
