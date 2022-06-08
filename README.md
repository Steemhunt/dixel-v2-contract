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
|  Methods                                           ·               25 gwei/gas                ·       1808.73 usd/eth       │
····························|························|·············|·············|··············|···············|··············
|  Contract                 ·  Method                ·  Min        ·  Max        ·  Avg         ·  # calls      ·  usd (avg)  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  createCollection      ·     832959  ·     878003  ·      851901  ·           93  ·      38.52  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateBeneficiary     ·          -  ·          -  ·       28965  ·            1  ·       1.31  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateCreationFee     ·          -  ·          -  ·       28707  ·            1  ·       1.30  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateImplementation  ·      28908  ·      28920  ·       28916  ·            3  ·       1.31  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2Factory       ·  updateMintingFee      ·          -  ·          -  ·       28673  ·            1  ·       1.30  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  addWhitelist          ·      56650  ·     218123  ·      109962  ·           26  ·       4.97  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  mintPrivate           ·          -  ·          -  ·      164483  ·            2  ·       7.44  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  mintPublic            ·     108878  ·     157510  ·      149216  ·           29  ·       6.75  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  removeWhitelist       ·      40351  ·      40363  ·       40357  ·            2  ·       1.82  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  setApprovalForAll     ·          -  ·          -  ·       48921  ·            1  ·       2.21  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  updateDescription     ·          -  ·          -  ·       62558  ·            1  ·       2.83  │
····························|························|·············|·············|··············|···············|··············
|  DixelClubV2NFT           ·  updateMetadata        ·      35535  ·      38756  ·       36140  ·            6  ·       1.63  │
····························|························|·············|·············|··············|···············|··············
|  ERC20                    ·  approve               ·          -  ·          -  ·       51434  ·            1  ·       2.33  │
····························|························|·············|·············|··············|···············|··············
|  ERC20PresetMinterPauser  ·  burn                  ·      45981  ·      50413  ·       47741  ·            7  ·       2.16  │
····························|························|·············|·············|··············|···············|··············
|  Deployments                                       ·                                          ·  % of limit   ·             │
·····················································|·············|·············|··············|···············|··············
|  ColorUtilsMock                                    ·          -  ·          -  ·      298893  ·        0.5 %  ·      13.52  │
·····················································|·············|·············|··············|···············|··············
|  DixelClubV2Factory                                ·    1162972  ·    1162984  ·     1162983  ·        1.9 %  ·      52.59  │
·····················································|·············|·············|··············|···············|··············
|  DixelClubV2NFT                                    ·          -  ·          -  ·     4505297  ·        7.5 %  ·     203.72  │
·····················································|·············|·············|··············|···············|··············
|  DixelClubV2NFTMock                                ·          -  ·          -  ·     5152998  ·        8.6 %  ·     233.01  │
·----------------------------------------------------|-------------|-------------|--------------|---------------|-------------·
```
