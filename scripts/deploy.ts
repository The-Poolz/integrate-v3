import {
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    VaultManager,
    SimpleBuilder,
} from "../typechain-types"
import {
    lockDealNFTArtifact,
    dealProviderArtifact,
    lockProviderArtifact,
    timedProviderArtifact,
} from "./utility/constants"
import { deploy } from "./utility/deployment"
import { ethers } from "hardhat"

async function deployAllContracts(baseURI: string = "") {
    const vaultManagerAddress: string = "0x9ff1dB30C66cD9d3311b4B22da49791610922b13"
    const vaultManager = (await ethers.getContractAt("VaultManager", vaultManagerAddress)) as VaultManager
    console.log("Deploying contracts...")

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy(lockDealNFTArtifact, vaultManager, baseURI)
    console.log("LockDealNFT deployed at:", lockDealNFT.address)
    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deploy(dealProviderArtifact, lockDealNFT.address)
    console.log("DealProvider deployed at:", dealProvider.address)
    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deploy(lockProviderArtifact, lockDealNFT.address, dealProvider.address)
    console.log("LockDealProvider deployed at:", lockProvider.address)
    // Deploy TimedDealProvider contract
    const timedDealProvider: TimedDealProvider = await deploy(
        timedProviderArtifact,
        lockDealNFT.address,
        lockProvider.address
    )
    console.log("TimedDealProvider deployed at:", timedDealProvider.address)

    // Deploy Buiders
    const simpleBuilder: SimpleBuilder = await deploy("SimpleBuilder", lockDealNFT.address)
    console.log("SimpleBuilder deployed at:", simpleBuilder.address)

    let tx = await vaultManager.setTrustee(lockDealNFT.address)
    await tx.wait()
    await setApprovedContracts(lockDealNFT, [
        dealProvider.address,
        lockProvider.address,
        timedDealProvider.address,
        simpleBuilder.address,
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
