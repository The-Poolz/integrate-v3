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
} from "../../../typechain-types"
import { deploy } from "../deployment"

async function deployAllContracts(baseURI: string = ""): Promise<string[]> {
    const addresses: string[] = []

    const vaultManager: VaultManager = await deploy("VaultManager")
    addresses.push("VaultManager address: " + vaultManager.address)

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy("LockDealNFT", vaultManager.address, baseURI)
    addresses.push("lockDealNFT address: " + lockDealNFT.address)

    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFT.address)
    addresses.push("dealProvider address: " + dealProvider.address)

    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFT.address, dealProvider.address)
    addresses.push("LockDealProvider address:" + lockProvider.address)

    // Deploy TimedDealProvider contract
    const timedDealProvider: TimedDealProvider = await deploy(
        "TimedDealProvider",
        lockDealNFT.address,
        lockProvider.address
    )
    addresses.push("TimedDealProvider address: " + timedDealProvider.address)

    // Deploy CollateralProvider contract
    const collateralProvider: CollateralProvider = await deploy(
        "CollateralProvider",
        lockDealNFT.address,
        dealProvider.address
    )
    addresses.push("CollateralProvider address: " + collateralProvider.address)

    // Deploy RefundProvider contract
    const refundProvider: RefundProvider = await deploy(
        "RefundProvider",
        lockDealNFT.address,
        collateralProvider.address
    )
    addresses.push("RefundProvider address: " + refundProvider.address)

    // Deploy Builders
    const simpleBuilder: SimpleBuilder = await deploy("SimpleBuilder", lockDealNFT.address)
    addresses.push("SimpleBuilder address: " + simpleBuilder.address)

    const simpleRefundBuilder: SimpleRefundBuilder = await deploy(
        "SimpleRefundBuilder",
        lockDealNFT.address,
        refundProvider.address,
        collateralProvider.address
    )
    addresses.push("SimpleRefundBuilder address: " + simpleRefundBuilder.address)

    let tx = await vaultManager.setTrustee(lockDealNFT.address)
    await tx.wait()
    await setApprovedContracts(lockDealNFT, addresses)

    return addresses // Return the array of deployed addresses
}

const baseURI = process.env.BASEURI || ""

deployAllContracts(baseURI).catch((error) => {
    console.error(error)
    process.exitCode = 1
})

async function setApprovedContracts(lockDealNFT: LockDealNFT, contracts: string[]) {
    for (const contract of contracts) {
        const tx = await lockDealNFT.setApprovedContract(contract, true)
        await tx.wait()
    }
}
