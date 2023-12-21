import {
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    CollateralProvider,
    RefundProvider,
    VaultManager,
    DelayVaultMigrator,
} from "../typechain-types"
import { v1DelayVault, POOLX } from "./utility/constants"
import { deploy, delayVaultSettings } from "./utility/deployment"

async function deployAllContracts(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy("LockDealNFT", vaultManager.address, baseURI)

    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFT.address)

    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFT.address, dealProvider.address)

    // Deploy TimedDealProvider contract
    await deploy("TimedDealProvider", lockDealNFT.address, lockProvider.address)

    // Deploy Migrator contract
    const migrator: DelayVaultMigrator = await deploy("DelayVaultMigrator", lockDealNFT.address, v1DelayVault)

    // Deploy DelayVaultProvider contract
    await deploy("DelayVaultProvider", POOLX, migrator.address, delayVaultSettings(lockProvider.address))

    // Deploy CollateralProvider contract
    const collateralProvider: CollateralProvider = await deploy(
        "CollateralProvider",
        lockDealNFT.address,
        dealProvider.address
    )

    // Deploy RefundProvider contract
    const refundProvider: RefundProvider = await deploy(
        "RefundProvider",
        lockDealNFT.address,
        collateralProvider.address
    )

    // Deploy Buiders
    await deploy("SimpleBuilder", lockDealNFT.address)
    await deploy("SimpleRefundBuilder", lockDealNFT.address, refundProvider.address, collateralProvider.address)
}

const baseURI = ""
deployAllContracts(baseURI).catch((error) => {
    console.error(error)
    process.exitCode = 1
})
