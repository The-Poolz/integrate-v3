import {
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    CollateralProvider,
    RefundProvider,
    VaultManager,
} from "../typechain-types"
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
    await deployed("TimedDealProvider", lockDealNFT.address, lockProvider.address)

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
