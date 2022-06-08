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
- DixelClubV2Factory: [0x4b4048b363dD807F0f8FF810cB0767aFa1772366](https://goerli.etherscan.io/address/0x4b4048b363dD807F0f8FF810cB0767aFa1772366#code)
- DixelClubV2NFT (implementation contract): [0x571f343bc898320b7610387eAD33db56001a9295](https://goerli.etherscan.io/address/0x571f343bc898320b7610387eAD33db56001a9295#code)

### BSC Testnet
- DixelClubV2Factory: [0x1a990771cE7F903A15A32B4647B614Bd5C4096d2](https://testnet.bscscan.com/address/0x1a990771cE7F903A15A32B4647B614Bd5C4096d2#code)
- DixelClubV2NFT (implementation contract): [0xD98437a9DfD8F2193c10A97Dc8380093Baebd36E](https://testnet.bscscan.com/address/0xD98437a9DfD8F2193c10A97Dc8380093Baebd36E#code)

### Klaytn Testnet (Baobob)
- DixelClubV2Factory: 0x32552E1BE7152206f0A01DB66de9d972a559937A
- DixelClubV2NFT (implementation contract): 0x512de6ef923f57307b0a85ad6c7f1ebdb9972F6b

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
|  Methods                                           ·               25 gwei/gas                ·       1765.17 usd/eth       │
····························|························|·············|·············|··············|···············|··············
|  Contract                 ·  Method                ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  createCollection      ·     810735  ·     855779  ·      829678  ·           93  ·      36.61  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateBeneficiary     ·          -  ·          -  ·       28965  ·            1  ·       1.28  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateCreationFee     ·          -  ·          -  ·       28707  ·            1  ·       1.27  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateImplementation  ·      28908  ·      28920  ·       28916  ·            3  ·       1.28  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateMintingFee      ·          -  ·          -  ·       28673  ·            1  ·       1.27  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  addWhitelist          ·      56672  ·     218145  ·      109984  ·           26  ·       4.85  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  mintPrivate           ·          -  ·          -  ·      159182  ·            2  ·       7.02  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  mintPublic            ·     103598  ·     152230  ·      143936  ·           29  ·       6.35  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  removeWhitelist       ·      40351  ·      40363  ·       40357  ·            2  ·       1.78  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  setApprovalForAll     ·          -  ·          -  ·       48863  ·            1  ·       2.16  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  updateDescription     ·          -  ·          -  ·       62580  ·            1  ·       2.76  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  updateMetadata        ·      35557  ·      38774  ·       36161  ·            6  ·       1.60  │
····························|························|·············|·············|··············|···············|··············
|  ERC20                    ·  approve               ·          -  ·          -  ·       53330  ·            1  ·       2.35  │
····························|························|·············|·············|··············|···············|··············
|  ERC20PresetMinterPauser  ·  burn                  ·      54179  ·      71279  ·       67316  ·            7  ·       2.97  │
····························|························|·············|·············|··············|···············|··············
|  Deployments                                       ·                                          ·  % of limit   ·             │
·····················································|·············|·············|··············|···············|··············
|  ColorUtilsMock                                    ·          -  ·          -  ·      298893  ·        0.5 %  ·      13.19  │
·····················································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                                ·    1162972  ·    1162984  ·     1162983  ·        1.9 %  ·      51.32  │
·····················································|·············|·············|··············|···············|··············
|  DixelClubV2NFT                                    ·          -  ·          -  ·     4520386  ·        7.5 %  ·     199.48  │
·····················································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock                                ·          -  ·          -  ·     5169708  ·        8.6 %  ·     228.14  │
·----------------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```
