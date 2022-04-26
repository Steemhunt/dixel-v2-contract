# Dixel Club V2

Pixel Art NFT factory that users can:
1. Create a new NFT collection with a 24x24 pixel art canvas
2. Mint a new edition on an existing collection with color variations (traits)

## Run Tests
```bash
npx hardhat test
```

## Contracts

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
