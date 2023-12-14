import {
    VaultManager,
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    CollateralProvider,
    RefundProvider,
} from "../../typechain-types"
import { deploy } from "../deploy"

export async function deployNFTandVaultManager(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")
    await deploy("LockDealNFT", vaultManager.address, baseURI)
}

export async function deploySimpleProviders(lockDealNFT: LockDealNFT) {
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFT.address)
    const lockProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFT.address, dealProvider.address)
    await deploy("TimedDealProvider", lockDealNFT.address, lockProvider.address)
}

export async function deployRefundWithCollateral(lockDealNFT: LockDealNFT, dealProvider: DealProvider) {
    const collateralProvider: CollateralProvider = await deploy(
        "CollateralProvider",
        lockDealNFT.address,
        dealProvider.address
    )
    await deploy("RefundProvider", lockDealNFT.address, collateralProvider.address)
}

export async function deployBuilders(
    lockDealNFT: LockDealNFT,
    refundProvider: RefundProvider,
    collateralProvider: CollateralProvider
) {
    await deploy("SimpleBuilder", lockDealNFT.address)
    await deploy("SimpleRefundBuilder", lockDealNFT.address, refundProvider.address, collateralProvider.address)
}
