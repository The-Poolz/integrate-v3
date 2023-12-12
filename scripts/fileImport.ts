import { downloadAndExtractZip } from "@poolzfinance/poolz-helper-v2"
import { cleanUpFolders } from "@poolzfinance/poolz-helper-v2"

async function downloadAndExtractZipAll() {
    try {
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/LockDealNFT/archive/refs/heads/master.zip",
            "contracts/"
        )
        await downloadAndExtractZip(
            "https://github.com/The-Poolz/VaultManager/archive/refs/heads/master.zip",
            "contracts/"
        )
        await cleanUpFolders("contracts/LockDealNFT")
        await cleanUpFolders("contracts/VaultManager")
    } catch (error) {
        console.error("An error occurred during download and compile:", error)
    }
}

downloadAndExtractZipAll()
