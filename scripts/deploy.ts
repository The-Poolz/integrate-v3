import {
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    CollateralProvider,
    RefundProvider,
    VaultManager,
    SimpleBuilder,
    SimpleRefundBuilder,
} from "../typechain-types"
import { ethers } from "hardhat"

export const deployed = async <T>(contractName: string, ...args: string[]): Promise<T> => {
    const Contract = await ethers.getContractFactory(contractName)
    const contract = await Contract.deploy(...args)
    return contract.deployed() as Promise<T>
}

async function deployAllContracts() {
    const vaultManager: VaultManager = await deployed("VaultManager")
    console.log(`VaultManager contract deployed to ${vaultManager.address}`)

    const baseURI = "https://nft.poolz.finance/test/metadata/"

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deployed("LockDealNFT", vaultManager.address, baseURI)
    console.log(`LockDealNFT contract deployed to ${lockDealNFT.address} with vaultManager ${vaultManager.address}`)

    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deployed("DealProvider", lockDealNFT.address)
    console.log(`DealProvider contract deployed to ${dealProvider.address} with lockDealNFT ${lockDealNFT.address}`)

    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deployed("LockDealProvider", lockDealNFT.address, dealProvider.address)
    console.log(`LockDealProvider contract deployed to ${lockProvider.address}`)

    // Deploy TimedDealProvider contract
    const timedDealProvider: TimedDealProvider = await deployed(
        "TimedDealProvider",
        lockDealNFT.address,
        lockProvider.address
    )
    console.log(`TimedDealProvider contract deployed to ${timedDealProvider.address}`)

    // Deploy CollateralProvider contract
    const collateralProvider: CollateralProvider = await deployed(
        "CollateralProvider",
        lockDealNFT.address,
        dealProvider.address
    )
    console.log(`CollateralProvider contract deployed to ${collateralProvider.address}`)

    // Deploy RefundProvider contract
    const refundProvider: RefundProvider = await deployed(
        "RefundProvider",
        lockDealNFT.address,
        collateralProvider.address
    )
    console.log(`RefundProvider contract deployed to ${refundProvider.address}`)

    // Deploy Buiders
    const simpleBuilder: SimpleBuilder = await deployed("SimpleBuilder", lockDealNFT.address)
    console.log("Simple Builder deployed to", simpleBuilder.address)

    const simpleRefundBuilder: SimpleRefundBuilder = await deployed(
        "SimpleRefundBuilder",
        lockDealNFT.address,
        refundProvider.address,
        collateralProvider.address
    )
    console.log("Simple Refund Builder deployed to", simpleRefundBuilder.address)
}

deployAllContracts().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
