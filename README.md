# integrate-v3

**`Integrate-v3`** is a repository that integrates all essential [**The-Poolz**](https://www.poolz.finance/) contracts for deployment and testing, leveraging **Hardhat**, **hardhat-dependency-compiler**, and **Truffle Dashboard**.

### Navigation

-   [Installation](#installation)
-   [Deployment Menu](#deployment-menu)
-   [License](#license)

## Installation

## Packages

```console
npm i
```

## Run deployment menu

```console
npm run menu
```

## Truffle dashboard deployment

```console
truffle dashboard
```

```console
npx hardhat run ./scripts/deploy.ts --network truffleDashboard
```

## Automated testnet transactions

```
npm run testnet
```

## Deployment menu

**`Integrate-v3`** provides an interactive console menu for deploying **The-Poolz** contracts. Each menu item represents a different type of deployment.

-   **Deploy all** - Deploys the following contracts: [`VaultManager`](https://github.com/The-Poolz/VaultManager), [`LockDealNFT`](https://github.com/The-Poolz/LockDealNFT), [`DealProvider`](https://github.com/The-Poolz/LockDealNFT/tree/master/contracts/SimpleProviders/DealProvider), [`LockDealProvider`](https://github.com/The-Poolz/LockDealNFT/tree/master/contracts/SimpleProviders/LockProvider), [`TimedDealProvider`](https://github.com/The-Poolz/LockDealNFT/tree/master/contracts/SimpleProviders/TimedDealProvider), [`SimpleBuilder`](https://github.com/The-Poolz/LockDealNFT.Builders), and [`DispenserProvider`](https://github.com/The-Poolz/LockDealNFT.DispenserProvider). It also sets up interactions with **The-Poolz** contract system.

-   **Upgrade from `v1.3` to `v1.4`** – Deploys the latest contract versions, introducing **immutable NFT** support and adding [`DispenserProvider`](https://github.com/The-Poolz/LockDealNFT.DispenserProvider). This update automatically deprecates [`SimpleRefundBuilder`](<(https://github.com/The-Poolz/LockDealNFT.Builders)>), [`CollateralProvider`](https://github.com/The-Poolz/LockDealNFT.CollateralProvider), and [`RefundProvider`](https://github.com/The-Poolz/LockDealNFT.RefundProvider), replacing them with the new distribution system. Choose this option to upgrade contracts from the previous deployment version to the latest one.

-   **Deploy a Specific Smart Contract** – **`Integrate-v3`** allows deploying individual or selected contracts as needed. Currently, it supports deploying [`SimpleProviders`](https://github.com/The-Poolz/LockDealNFT/tree/master/contracts/SimpleProviders), [`VaultManager`](https://github.com/The-Poolz/VaultManager), [`LockDealNFT`](https://github.com/The-Poolz/LockDealNFT), [`SimpleBuilder`](https://github.com/The-Poolz/LockDealNFT.Builders), and [`DispenserProvider`](https://github.com/The-Poolz/LockDealNFT.DispenserProvider).

## License

[**The-Poolz**](poolz.finance) Contracts is released under the **MIT License**.
