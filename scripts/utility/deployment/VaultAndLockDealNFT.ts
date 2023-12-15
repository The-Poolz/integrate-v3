import { VaultManager } from "../../../typechain-types"
import { deploy } from "../../deploy"

export async function deployNFTandVaultManager(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")
    await deploy("LockDealNFT", vaultManager.address, baseURI)
}

deployNFTandVaultManager()
