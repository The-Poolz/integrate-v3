import { downloadAndExtractZip } from "@poolzfinance/poolz-helper-v2"
import { cleanUpFolders, replaceFileContents } from "@poolzfinance/poolz-helper-v2"

async function downloadAndExtractZipAll() {
    try {
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/LockDealNFT/archive/refs/heads/ironblocks.zip",
            "contracts/"
        )
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/VaultManager/archive/refs/heads/ironblocks.zip",
            "contracts/"
        )
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/LockDealNFT.DelayVaultProvider/archive/refs/heads/ironblocks.zip",
            "contracts/"
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
