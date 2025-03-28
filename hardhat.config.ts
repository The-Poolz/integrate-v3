import "@truffle/dashboard-hardhat-plugin"
import "hardhat-gas-reporter"
import { HardhatUserConfig } from "hardhat/config"
import "solidity-coverage"
import "hardhat-dependency-compiler"
import '@typechain/hardhat';
import '@nomicfoundation/hardhat-network-helpers';
import '@nomicfoundation/hardhat-chai-matchers';

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    solidity: {
        version: "0.8.28",
        settings: {
            evmVersion: "cancun",
            optimizer: {
                enabled: true,
                runs: 200,
            },
            viaIR: true,
        },
    },
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
            blockGasLimit: 130_000_000,
        },
        ropsten: {
            url: "https://ropsten.infura.io/v3/your-infura-project-id",
            accounts: [], // Replace with your testnet accounts' private keys
        },
        rinkeby: {
            url: "https://rinkeby.infura.io/v3/your-infura-project-id",
            accounts: [], // Replace with your testnet accounts' private keys
        },
        kovan: {
            url: "https://kovan.infura.io/v3/your-infura-project-id",
            accounts: [], // Replace with your testnet accounts' private keys
        },
        goerli: {
            url: "https://goerli.infura.io/v3/your-infura-project-id",
            accounts: [], // Replace with your testnet accounts' private keys
        },
        bsc_testnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545",
            chainId: 97,
            accounts: [], // Replace with your testnet accounts' private keys
        },
        polygon_mumbai: {
            url: "https://rpc-mumbai.matic.today",
            accounts: [], // Replace with your testnet accounts' private keys
        },
        fantom_testnet: {
            url: "https://rpc.testnet.fantom.network",
            accounts: [], // Replace with your testnet accounts' private keys
        },
        avalanche_fuji: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            accounts: [], // Replace with your testnet accounts' private keys
        },
        harmony_testnet: {
            url: "https://api.s0.b.hmny.io",
            accounts: [], // Replace with your testnet accounts' private keys
        },
        mainnet: {
            url: "https://mainnet.infura.io/v3/your-infura-project-id",
            accounts: [], // Replace with your mainnet accounts' private keys
        },
    },
    gasReporter: {
        enabled: true,
        showMethodSig: true,
        currency: 'USD',
        token: 'ETH',
        gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=' + process.env.ETHERSCAN_API_KEY,
        coinmarketcap: process.env.CMC_API_KEY || '',
        noColors: true,
        reportFormat: "markdown",
        outputFile: "gasReport.md",
        forceTerminalOutput: true,
        L1: "ethereum",
        forceTerminalOutputFormat: "terminal"
    },
    dependencyCompiler: {
        paths: [
          '@poolzfinance/lockdeal-nft/contracts/LockDealNFT/LockDealNFT.sol',
          '@poolzfinance/lockdeal-nft/contracts/SimpleProviders/DealProvider/DealProvider.sol',
          '@poolzfinance/lockdeal-nft/contracts/SimpleProviders/LockProvider/LockDealProvider.sol',
          '@poolzfinance/lockdeal-nft/contracts/SimpleProviders/TimedDealProvider/TimedDealProvider.sol',
          '@poolzfinance/builders/contracts/SimpleBuilder/SimpleBuilder.sol',
          '@poolzfinance/vault-manager/contracts/VaultManager/VaultManager.sol',
          '@poolzfinance/vault-manager/contracts/test/ERC20Token.sol',
          '@poolzfinance/dispenser-provider/contracts/DispenserProvider.sol',
          '@poolzfinance/invest-provider/contracts/InvestProvider.sol',
        ],
      }
}

export default config
