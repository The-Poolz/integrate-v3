import {
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    CollateralProvider,
    RefundProvider,
    VaultManager,
    DelayVaultMigrator,
    IDelayVaultProvider,
} from "../typechain-types"
import { utils } from "ethers"
import { ethers } from "hardhat"

export const deployed = async <T>(contractName: string, ...args: string[]): Promise<T> => {
    const Contract = await ethers.getContractFactory(contractName)
    const contract = await Contract.deploy(...args)
    console.log(`${contractName} contract deployed to ${contract.address}`)
    return contract.deployed() as Promise<T>
}

async function deployAllContracts() {
    const vaultManager: VaultManager = await deployed("VaultManager")
    const baseURI = "https://nft.poolz.finance/test/metadata/"

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deployed("LockDealNFT", vaultManager.address, baseURI)

    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deployed("DealProvider", lockDealNFT.address)

    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deployed("LockDealProvider", lockDealNFT.address, dealProvider.address)

    // Deploy TimedDealProvider contract
    const timedDealProvider: TimedDealProvider = await deployed(
        "TimedDealProvider",
        lockDealNFT.address,
        lockProvider.address
    )

    // Deploy Migrator contract
    // testnet v1DelayVault address: 0x607155A953d5f598d2F7CcD9a6395Af389cfecE5
    // mainnet v1DelayVault address: 0x5eb57B1210338b13E3D5572d5e1670285Aa71702
    const v1DelayVault = "0x607155A953d5f598d2F7CcD9a6395Af389cfecE5"
    const migrator: DelayVaultMigrator = await deployed("DelayVaultMigrator", lockDealNFT.address, v1DelayVault)

    // Deploy DelayVaultProvider contract
    const DelayVaultProvider = await ethers.getContractFactory("DelayVaultProvider")
    const settings: IDelayVaultProvider.ProviderDataStruct[] = delayVaultSettings(
        dealProvider.address,
        lockProvider.address,
        timedDealProvider.address
    )
    // testnet POOLX address: 0xE14A2A1006B83F363569BC7b5b733191E919ca34
    // mainnet POOLX address: 0xbAeA9aBA1454DF334943951d51116aE342eAB255
    const POOLX = "0xE14A2A1006B83F363569BC7b5b733191E919ca34"
    await DelayVaultProvider.deploy(POOLX, migrator.address, settings)

    // Deploy CollateralProvider contract
    const collateralProvider: CollateralProvider = await deployed(
        "CollateralProvider",
        lockDealNFT.address,
        dealProvider.address
    )

    // Deploy RefundProvider contract
    const refundProvider: RefundProvider = await deployed(
        "RefundProvider",
        lockDealNFT.address,
        collateralProvider.address
    )

    // Deploy Buiders
    await deployed("SimpleBuilder", lockDealNFT.address)
    await deployed("SimpleRefundBuilder", lockDealNFT.address, refundProvider.address, collateralProvider.address)
}

deployAllContracts().catch((error) => {
    console.error(error)
    process.exitCode = 1
})

// Example abi.hashex for encoded data: [
//     ["0xb6bb31a46744f3946fcf799f74109d8b894778ca", [], "250000000000000000000"],
//     ["0xa81cfa97856db04bc225a2dcc902dcd3fd7f9d84", [604800], "3500000000000000000000"],
//     ["0x999a76a387ad9d199544cfbafad1673a2c39aa11", [604800, 2419200], "20000000000000000000000"],
// ]

function delayVaultSettings(dealProvider: string, lockProvider: string, timedDealProvider: string) {
    const tier1 = utils.parseUnits("250", 18)
    const tier2 = utils.parseUnits("3500", 18)
    const tier3 = utils.parseUnits("20000", 18)
    const ONE_DAY = 86400
    const week = ONE_DAY * 7
    const startTime = week
    const finishTime = week * 4
    return [
        { provider: dealProvider, params: [], limit: tier1 },
        { provider: lockProvider, params: [startTime], limit: tier2 },
        { provider: timedDealProvider, params: [startTime, finishTime], limit: tier3 },
    ]
}
