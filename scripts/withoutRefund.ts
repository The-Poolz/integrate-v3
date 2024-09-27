import {
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    VaultManager,
    SimpleBuilder
} from "../typechain-types"
import { deploy } from "./utility/deployment"

async function deployAllContractsWithoutRefund(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy("LockDealNFT", vaultManager.address, baseURI)

    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFT.address)

    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFT.address, dealProvider.address)

    // Deploy TimedDealProvider contract
    const timedDealProvider: TimedDealProvider = await deploy("TimedDealProvider", lockDealNFT.address, lockProvider.address)

    // Deploy Buiders
    const simpleBuilder: SimpleBuilder = await deploy("SimpleBuilder", lockDealNFT.address)

    let tx = await vaultManager.setTrustee(lockDealNFT.address)
    await tx.wait()
    await setApprovedContracts(lockDealNFT, [
        dealProvider.address,
        lockProvider.address,
        timedDealProvider.address,
        simpleBuilder.address
    ])
}

const baseURI = process.env.BASEURI || ""

deployAllContractsWithoutRefund(baseURI).catch((error) => {
    console.error(error)
    process.exitCode = 1
})

async function setApprovedContracts(lockDealNFT: LockDealNFT, contracts: string[]) {
    for (const contract of contracts) {
        const tx = await lockDealNFT.setApprovedContract(contract, true)
        await tx.wait()
    }
}
