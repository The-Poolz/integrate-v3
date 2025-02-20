import {
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    VaultManager,
    SimpleBuilder,
    DispenserProvider
} from "../typechain-types"
import { deploy } from "./utility/deployment"

async function deployAllContracts(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy("LockDealNFT", vaultManager.address, baseURI)
    // Set trustee
    let tx = await vaultManager.setTrustee(lockDealNFT.address)
    await tx.wait()

    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFT.address)

    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFT.address, dealProvider.address)

    // Deploy TimedDealProvider contract
    const timedDealProvider: TimedDealProvider = await deploy("TimedDealProvider", lockDealNFT.address, lockProvider.address)

    // Deploy Buiders
    const simpleBuilder: SimpleBuilder = await deploy("SimpleBuilder", lockDealNFT.address)

    // Deploy DispenserProvider
    const dispenserProvider: DispenserProvider = await deploy("DispenserProvider", lockDealNFT.address)
    
    // Set approved contracts
    await setApprovedContracts(lockDealNFT, [
        dealProvider.address,
        lockProvider.address,
        timedDealProvider.address,
        simpleBuilder.address,
        dispenserProvider.address
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
