import { downloadAndExtractZip } from "@poolzfinance/poolz-helper-v2"
import { cleanUpFolders, removeFolderRecursively } from "@poolzfinance/poolz-helper-v2"
import { existsSync } from "fs"

async function downloadAndExtractZipAll() {
    try {
        const contractsFolder = "contracts/"
        // Check if the folder exists before attempting to remove it
        if (existsSync(contractsFolder)) {
            await removeFolderRecursively(contractsFolder)
        }
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/LockDealNFT/archive/refs/tags/v1.0.1.zip",
            contractsFolder
        )
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/LockDealNFT.Builders/archive/refs/tags/v1.2.1.zip",
            contractsFolder
        )
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/LockDealNFT.CollateralProvider/archive/refs/tags/v1.0.1.zip",
            contractsFolder
        )
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/LockDealNFT.RefundProvider/archive/refs/tags/v1.0.1.zip",
            contractsFolder
        )
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/VaultManager/archive/refs/tags/v0.0.4-ironblocks.zip",
            contractsFolder
        )
        await cleanUpFolders("contracts/LockDealNFT")
        await cleanUpFolders("contracts/VaultManager")
        await cleanUpFolders("contracts/LockDealNFT.Builders")
        await cleanUpFolders("contracts/LockDealNFT.CollateralProvider")
        await cleanUpFolders("contracts/LockDealNFT.RefundProvider")
    } catch (error) {
        console.error("An error occurred during download and compile:", error)
    }
}

downloadAndExtractZipAll()
