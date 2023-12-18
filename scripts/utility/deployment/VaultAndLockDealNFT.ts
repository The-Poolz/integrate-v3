import { deploy } from "../deployment"
import { VaultManager } from "../../../typechain-types"

async function deployNFTandVaultManager(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")
    await deploy("LockDealNFT", vaultManager.address, baseURI)
}

// Retrieve environment variable
const baseURI = process.env.BASEURI || ""

deployNFTandVaultManager(baseURI)
