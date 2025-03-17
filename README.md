# integrate-v3

**Integrate-v3** is a repository that integrates all essential [The-Poolz](https://www.poolz.finance/) contracts for deployment and testing, leveraging **Hardhat**, **hardhat-dependency-compiler**, and **Truffle Dashboard**.

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

**Integrate-v3** provides an interactive console menu for deploying **The-Poolz** contracts. Each menu item represents a different type of deployment.

-   Deploy all - Deploys the following contracts: `VaultManager`, `LockDealNFT`, `DealProvider`, `LockDealProvider`, `TimedDealProvider`, `SimpleBuilder`, and `DispenserProvider`. It also sets up interactions with **The-Poolz** contract system.

## License

[**The-Poolz**](poolz.finance) Contracts is released under the **MIT License**.
