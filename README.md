# Dixel Club V2

[🌏 Official Interface](https://dixelclub.com/) | [📖 Official Docs](https://docs.dixelclub.com/)

Pixel Art NFT factory that users can:
1. Creators: Create a new NFT collection with a 24x24 pixel art canvas with following parameters
    - name
    - symbol
    - description
    - max minting supply (1 - 1,000,000)
    - minting cost (in native currency: ETH, BNB, KLAY, MATIC, OKT)
    - royalty (receiving address, percentage: 0 - 10%)
    - minting initiation time (unix timestamp)
    - whitelistOnly (boolean, whitelist can be added by the creator later)
    - hidden (boolean, hide the collection from the official main page listing)
2. Collectors: Mint a new edition on an existing collection with color variations

[🧪 Testnet Demo](https://v2testnet.dixel.club/) - Available on following testnets
- Ethereum Goerli ([Faucet](https://goerli-faucet.mudit.blog/), [Faucet2](https://faucet.paradigm.xyz/))
- Klayten Baobao ([Faucet](https://baobab.wallet.klaytn.foundation/faucet))
- BNB Smart Chain ([Faucet](https://testnet.binance.org/faucet-smart))

## Community Audit
We held a community-based security audit with **$10,000 USDT bounty**  in June 2022

- 🛠 Announcement: [Community Audit Guide](https://github.com/Steemhunt/dixel-v2-contract/blob/main/COMMUNITY_AUDIT.md)
- 💰 Result: https://github.com/Steemhunt/dixel-v2-contract/issues/28

## Run Tests
```bash
npx hardhat test
```

## Contracts
Latest version: v2.9.262 / NFT version: 5

### Ethereum
- DixelClubV2Factory: [0x43c71D3fAb7CE185C4D569f8fc3C93dF95334c57](https://etherscan.io/address/0x43c71D3fAb7CE185C4D569f8fc3C93dF95334c57#code)
- DixelClubV2NFT (V6 implementation): [0x40ebDdC0A81836C8B3bdFd78a8C3928e14B90CaF](https://etherscan.io/address/0x40ebDdC0A81836C8B3bdFd78a8C3928e14B90CaF#code)

### Base
- DixelClubV2Factory: [0x8b0Fdc91A4e0259ec6a29b3507a7Ea6E1d04A8fF](https://basescan.io/address/0x8b0Fdc91A4e0259ec6a29b3507a7Ea6E1d04A8fF#code)
- DixelClubV2NFT (V6 implementation): [0x66BF6409A52E634262BD04c0005562f229b03778](https://basescan.io/address/0x66BF6409A52E634262BD04c0005562f229b03778#code)

### BNB Chain
- DixelClubV2Factory: [0x9326c3A25935d11a6510a0A4eb18233AB2963f38](https://bscscan.com/address/0x9326c3A25935d11a6510a0A4eb18233AB2963f38#code)
- DixelClubV2NFT (V6 implementation): [0xED7cf5FdB58c752af0D59C4E76f38791ED648207](https://bscscan.com/address/0xED7cf5FdB58c752af0D59C4E76f38791ED648207#code)

### Polygon
- DixelClubV2Factory: [0x0E5F42f6308C13dBf9c7e18B5bd956048A50486f](https://polygonscan.com/address/0x0E5F42f6308C13dBf9c7e18B5bd956048A50486f#code)
- DixelClubV2NFT: [0xA2A00Cd4aC9085c0E0Be7bd18Cf236D35E08C2B2](https://polygonscan.com/address/0xA2A00Cd4aC9085c0E0Be7bd18Cf236D35E08C2B2#code)

### Kaia
- DixelClubV2Factory: [0x82b91E6DEDE8B8acDADe2212983DF946CA695d1e](https://kaiascope.com/account/0x82b91E6DEDE8B8acDADe2212983DF946CA695d1e?tabId=contractCode)
- DixelClubV2NFT (V6 implementation): [0x3057F94cA4F9c174E0050EeFe29144D56c104B45](https://kaiascope.com/account/0x3057F94cA4F9c174E0050EeFe29144D56c104B45?tabId=contractCode)

### Base Sepolia
- DixelClubV2Factory: [0xC14d558AfFE9457E620338E7f2166Ae29E884463](https://sepolia.basescan.org/address/0xC14d558AfFE9457E620338E7f2166Ae29E884463#code)
- DixelClubV2NFT (V5 implementation): [0xB43826E079dFB2e2b48a0a473Efc7F1fe6391763](https://sepolia.basescan.org/address/0xB43826E079dFB2e2b48a0a473Efc7F1fe6391763#code)


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
|  Methods                                      ·               10 gwei/gas                ·       1058.96 usd/eth       │
·······················|························|·············|·············|··············|···············|··············
|  Contract            ·  Method                ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  createCollection      ·     821427  ·     866471  ·      840542  ·          105  ·       8.90  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateBeneficiary     ·          -  ·          -  ·       28965  ·            1  ·       0.31  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateCreationFee     ·          -  ·          -  ·       28685  ·            1  ·       0.30  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateImplementation  ·      28908  ·      28920  ·       28916  ·            3  ·       0.31  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory  ·  updateMintingFee      ·          -  ·          -  ·       28673  ·            1  ·       0.30  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  addWhitelist          ·      56650  ·     218123  ·      108808  ·           29  ·       1.15  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  approve               ·          -  ·          -  ·       51478  ·            1  ·       0.55  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  burn                  ·      45964  ·      50396  ·       47503  ·            8  ·       0.50  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mintPrivate           ·          -  ·          -  ·      164506  ·            2  ·       1.74  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  mintPublic            ·     108921  ·     160448  ·      150094  ·           59  ·       1.59  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  removeWhitelist       ·      40351  ·      40363  ·       40357  ·            2  ·       0.43  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  resetWhitelist        ·          -  ·          -  ·       45193  ·            1  ·       0.48  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  setApprovalForAll     ·          -  ·          -  ·       48921  ·            1  ·       0.52  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateDescription     ·      34636  ·      77277  ·       50369  ·            4  ·       0.53  │
·······················|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT      ·  updateMetadata        ·      35535  ·      38756  ·       36140  ·            6  ·       0.38  │
·······················|························|·············|·············|··············|···············|··············
|  Deployments                                  ·                                          ·  % of limit   ·             │
················································|·············|·············|··············|···············|··············
|  ColorUtilsMock                               ·          -  ·          -  ·      298893  ·        0.5 %  ·       3.17  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                           ·    1086188  ·    1086200  ·     1086199  ·        1.8 %  ·      11.50  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2NFT                               ·          -  ·          -  ·     4500080  ·        7.5 %  ·      47.65  │
················································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock                           ·          -  ·          -  ·     5147733  ·        8.6 %  ·      54.51  │
·-----------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```
