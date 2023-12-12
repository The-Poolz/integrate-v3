import {
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    CollateralProvider,
    RefundProvider,
    VaultManager,
} from "../typechain-types"
import { deployed } from "@poolzfinance/poolz-helper-v2"

const deploy = async <T>(contractName: string, ...args: string[]): Promise<T> => {
    const contract = (await deployed(contractName, ...args)) as unknown as T & { address: string }
    console.log(`${contractName} deployed at: ${contract.address}`)
    return contract
}

async function deployAllContracts(baseURI = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy("LockDealNFT", vaultManager.address, baseURI)

    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFT.address)

    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFT.address, dealProvider.address)

    // Deploy TimedDealProvider contract
    await deployed("TimedDealProvider", lockDealNFT.address, lockProvider.address)

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

const baseURI = "https://nft.poolz.finance/test/metadata/"
deployAllContracts(baseURI).catch((error) => {
    console.error(error)
    process.exitCode = 1
})
