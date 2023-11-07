import { downloadAndExtractZip } from "../TestSetup"
import fs from "fs"
import path from "path"

async function downloadAndExtractZipAll() {
    try {
        await downloadAndExtractZip(
            "https://github.com/spherex-collab/LockDealNFT/archive/refs/heads/spherex.zip",
            "contracts/"
        )
        await downloadAndExtractZip(
            "https://github.com/spherex-collab/VaultManager/archive/refs/heads/spherex.zip",
            "contracts/"
        )
        await downloadAndExtractZip(
            "https://github.com/spherex-collab/LockDealNFT.DelayVaultProvider/archive/refs/heads/spherex.zip",
            "contracts/"
        )
        cleanUpFolders("contracts/LockDealNFT")
        cleanUpFolders("contracts/VaultManager")
        cleanUpFolders("contracts/LockDealNFT.DelayVaultProvider")
        replaceFileContents(
            "contracts/LockDealNFT.DelayVaultProvider/contracts/interfaces",
            "../LockDealNFT",
            "../../../LockDealNFT"
        )
        replaceFileContents("contracts/LockDealNFT.DelayVaultProvider/", '"./LockDealNFT', `"../../LockDealNFT`)
    } catch (error) {
        console.error("An error occurred during download and compile:", error)
    }
}

function cleanUpFolders(parentDir: string) {
    // Get a list of all files and subfolders in the parent directory
    const items = fs.readdirSync(parentDir)

    for (const item of items) {
        const itemPath = path.join(parentDir, item)

        // Check if it's a directory
        if (fs.lstatSync(itemPath).isDirectory()) {
            // If it's not named "contracts," delete it
            if (item !== "contracts") {
                removeFolderRecursively(itemPath)
            }
        } else {
            // It's a file, so delete it
            fs.unlinkSync(itemPath)
        }
    }
}

function removeFolderRecursively(folderPath: string) {
    // Recursively delete the folder and its contents
    const items = fs.readdirSync(folderPath)

    for (const item of items) {
        const itemPath = path.join(folderPath, item)

        if (fs.lstatSync(itemPath).isDirectory()) {
            removeFolderRecursively(itemPath)
        } else {
            fs.unlinkSync(itemPath)
        }
    }

    // After all contents are deleted, remove the folder itself
    fs.rmdirSync(folderPath)
}

function replaceFileContents(directory: string, searchStr: string, replaceStr: string) {
    const items = fs.readdirSync(directory)

    for (const item of items) {
        const itemPath = path.join(directory, item)

        if (fs.lstatSync(itemPath).isDirectory()) {
            // If it's a directory, call the function recursively
            replaceFileContents(itemPath, searchStr, replaceStr)
        } else {
            // It's a file, so read its content and replace the strings
            let fileContent = fs.readFileSync(itemPath, "utf8")
            fileContent = fileContent.replace(new RegExp(searchStr, "g"), replaceStr)
            fs.writeFileSync(itemPath, fileContent, "utf8")
        }
    }
}

downloadAndExtractZipAll()
