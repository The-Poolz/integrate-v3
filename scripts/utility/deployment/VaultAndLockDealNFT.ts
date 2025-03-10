import { VaultManager, LockDealNFT } from "../../../typechain-types"
import { deploy } from "../deployment"

async function deployNFTandVaultManager(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")
    await deploy("LockDealNFT", vaultManager.address, baseURI)
    // deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy("LockDealNFT", await vaultManager.getAddress(), baseURI)
    // Set trustee
    let tx = await vaultManager.setTrustee(await lockDealNFT.getAddress())
    await tx.wait()
    console.log("LockDealNFT and VaultManager deployed successfully")
    console.log("LockDealNFT address: ", await lockDealNFT.getAddress())
    console.log("VaultManager address: ", await vaultManager.getAddress())
}

// Retrieve environment variable
const baseURI = process.env.BASEURI || ""

deployNFTandVaultManager(baseURI)
