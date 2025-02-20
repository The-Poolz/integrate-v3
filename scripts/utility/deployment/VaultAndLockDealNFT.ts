import { VaultManager, LockDealNFT } from "../../../typechain-types"
import { deploy } from "../deployment"

async function deployNFTandVaultManager(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")
    await deploy("LockDealNFT", vaultManager.address, baseURI)
    // deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy("LockDealNFT", vaultManager.address, baseURI)
    // Set trustee
    let tx = await vaultManager.setTrustee(lockDealNFT.address)
    await tx.wait()
    console.log("LockDealNFT and VaultManager deployed successfully")
    console.log("LockDealNFT address: ", lockDealNFT.address)
    console.log("VaultManager address: ", vaultManager.address)
}

// Retrieve environment variable
const baseURI = process.env.BASEURI || ""

deployNFTandVaultManager(baseURI)
