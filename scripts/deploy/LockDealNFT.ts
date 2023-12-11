import {
    VaultManager,
} from "../typechain-types"
import { deployed } from "./helper"

export async function deployNFTandVaultManager() {
    const vaultManager: VaultManager = await deployed("VaultManager")
    const baseURI = "https://nft.poolz.finance/test/metadata/"
    await deployed("LockDealNFT", vaultManager.address, baseURI)
}
