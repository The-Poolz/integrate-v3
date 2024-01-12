import { downloadAndExtractZip } from "@poolzfinance/poolz-helper-v2"
import { cleanUpFolders, replaceFileContents, removeFolderRecursively } from "@poolzfinance/poolz-helper-v2"
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
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/LockDealNFT.DelayVaultProvider/archive/refs/heads/master.zip",
            contractsFolder
        )
        await cleanUpFolders("contracts/LockDealNFT")
        await cleanUpFolders("contracts/VaultManager")
        await cleanUpFolders("contracts/LockDealNFT.DelayVaultProvider")
        await replaceFileContents(
            "contracts/LockDealNFT.DelayVaultProvider/contracts/interfaces",
            "../LockDealNFT",
            "../../../LockDealNFT"
        )
        await replaceFileContents("contracts/LockDealNFT.DelayVaultProvider/", '"./LockDealNFT', `"../../LockDealNFT`)
    } catch (error) {
        console.error("An error occurred during download and compile:", error)
    }
}

downloadAndExtractZipAll()
