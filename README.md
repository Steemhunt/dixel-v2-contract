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
Latest version: v2.7.145 / NFT version: 3


### Ethereum
- DixelClubV2Factory: [0x66BF6409A52E634262BD04c0005562f229b03778](https://etherscan.io/address/0x66BF6409A52E634262BD04c0005562f229b03778#code)
- DixelClubV2NFT (implementation contract): [0x55643fC13a68C16F7A156ca7587dfB4484cdD9D4](https://etherscan.io/address/0x55643fC13a68C16F7A156ca7587dfB4484cdD9D4#code)

### BNB Chain
- DixelClubV2Factory: [0xB76110E9cb56c0dba1596F3413A6DB9023e36463](https://bscscan.com/address/0xB76110E9cb56c0dba1596F3413A6DB9023e36463#code)
- DixelClubV2NFT (implementation contract): [0x0a6bFC69b94c74EC983EE02448f23D373260a6a8](https://bscscan.com/address/0x0a6bFC69b94c74EC983EE02448f23D373260a6a8#code)

### Klaytn
- DixelClubV2Factory: 0x31B8eb1d3DcB2C333e5d70cAA022855ffdBD0fDA
- DixelClubV2NFT (implementation contract): 0x1d04AD4D2617284F18A9ca23C3cC623D990D01A9


### Ethereum Testnet (Goerli)
- DixelClubV2Factory: [0x4705d764d68Fb4008644c913dB6f35Da0AD6E47E](https://goerli.etherscan.io/address/0x4705d764d68Fb4008644c913dB6f35Da0AD6E47E#code)
- DixelClubV2NFT (implementation contract): [0x0EfcAF3Cf45ff90bd3b490A2fC6AC99Af5A94147](https://goerli.etherscan.io/address/0x0EfcAF3Cf45ff90bd3b490A2fC6AC99Af5A94147#code)

### BSC Testnet
- DixelClubV2Factory: [0xCD18115eA09460658EB6E5B7De8DD9C906024Ac9](https://testnet.bscscan.com/address/0xCD18115eA09460658EB6E5B7De8DD9C906024Ac9#code)
- DixelClubV2NFT (implementation contract): [0xc349b025c0BF5E37d763e06ECC8C1844EA807fF5](https://testnet.bscscan.com/address/0xc349b025c0BF5E37d763e06ECC8C1844EA807fF5#code)

### Klaytn Testnet (Baobob)
- DixelClubV2Factory: 0xc827784cbF2EDCbD8874099130721f466113F454
- DixelClubV2NFT (implementation contract): 0xa07bbC697d5732E47D19FA38a10108316DdD6bfd

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
