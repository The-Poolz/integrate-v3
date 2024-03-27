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
            "https://github.com/The-Poolz/LockDealNFT/archive/refs/heads/master.zip",
            contractsFolder
        )
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/VaultManager/archive/refs/heads/master.zip",
            contractsFolder
        )
        await cleanUpFolders("contracts/LockDealNFT")
        await cleanUpFolders("contracts/VaultManager")
    } catch (error) {
        console.error("An error occurred during download and compile:", error)
    }
}

downloadAndExtractZipAll()
