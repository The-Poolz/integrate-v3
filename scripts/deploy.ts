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
import {
    lockDealNFTArtifact,
    dealProviderArtifact,
    lockProviderArtifact,
    timedProviderArtifact,
    collateralProviderArtifact,
    refundProviderArtifact,
} from "./utility/constants"
import { deploy } from "./utility/deployment"

async function deployAllContracts(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy(lockDealNFTArtifact, vaultManager.address, baseURI)

    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deploy(dealProviderArtifact, lockDealNFT.address)

    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deploy(lockProviderArtifact, lockDealNFT.address, dealProvider.address)

    // Deploy TimedDealProvider contract
    const timedDealProvider: TimedDealProvider = await deploy(timedProviderArtifact, lockDealNFT.address, lockProvider.address)

    // Deploy CollateralProvider contract
    const collateralProvider: CollateralProvider = await deploy(
        collateralProviderArtifact,
        lockDealNFT.address,
        dealProvider.address
    )

    // Deploy RefundProvider contract
    const refundProvider: RefundProvider = await deploy(
        refundProviderArtifact,
        lockDealNFT.address,
        collateralProvider.address
    )

    // Deploy Buiders
    const simpleBuilder: SimpleBuilder = await deploy("SimpleBuilder", lockDealNFT.address)
    const simpleRefundBuilder: SimpleRefundBuilder = await deploy("SimpleRefundBuilder", lockDealNFT.address, refundProvider.address, collateralProvider.address)
    
    let tx = await vaultManager.setTrustee(lockDealNFT.address)
    await tx.wait()
    await setApprovedContracts(lockDealNFT, [
        dealProvider.address,
        lockProvider.address,
        timedDealProvider.address,
        collateralProvider.address,
        refundProvider.address,
        simpleBuilder.address,
        simpleRefundBuilder.address,
    ])
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
