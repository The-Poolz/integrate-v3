// scriptHandler.js
const path = require("path")
const { exec } = require("child_process")
const util = require("util")
import {
    getMenu,
    getBaseURI,
    getLockDealNFTAddress,
    getDealProviderAddress,
    getCollateralProviderAddress,
    getOldDelay,
    getNewDelay,
} from "./utility/deployment/input"
const execAsync = util.promisify(exec)

const scriptPaths = [
    "VaultAndLockDealNFT.ts",
    "SimpleProviders.ts",
    "RefundAndCollateral.ts",
    "RefundProvider.ts",
    "Builders.ts",
    "LightMigrator.ts",
]

const menuItems = [
    ...scriptPaths.map((script) => ({ name: `Deploy ${script.replace(".ts", "")}` })),
    { name: "Deploy All contracts\n\n" },
]

async function displayMenu() {
    try {
        const answer = await getMenu(menuItems)

        switch (answer) {
            case menuItems[0].name:
                process.env.BASEURI = await getBaseURI()
                await execAsync(
                    "npx hardhat run scripts/utility/deployment/VaultAndLockDealNFT.ts --network truffleDashboard"
                )
                break
            case menuItems[1].name:
                process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
                await execAsync(
                    "npx hardhat run scripts/utility/deployment/SimpleProviders.ts --network truffleDashboard"
                )
                break
            case menuItems[2].name:
                process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
                process.env.PROVIDER_ADDRESS = await getDealProviderAddress()
                await execAsync(
                    "npx hardhat run scripts/utility/deployment/RefundAndCollateral.ts --network truffleDashboard"
                )
                break
            case menuItems[3].name:
                process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
                process.env.COLLATERAL = await getCollateralProviderAddress()
                await execAsync(
                    "npx hardhat run scripts/utility/deployment/RefundProvider.ts --network truffleDashboard"
                )
                break
            case menuItems[5].name:
                process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
                process.env.OLD_DELAY = await getOldDelay()
                process.env.NEW_DELAY = await getNewDelay()
                await execAsync(
                    "npx hardhat run scripts/utility/deployment/LightMigrator.ts --network truffleDashboard"
                )
            case "Deploy All contracts\n\n":
                await execAsync("npx hardhat run scripts/deploy.ts --network truffleDashboard")
                break
            default:
                // Deploy the selected script
                const scriptName = answer.replace("Deploy ", "")
                const scriptPath = path.join("scripts", "utility", "deployment", `${scriptName}.ts`)
                await execAsync(`npx hardhat run ${scriptPath} --network truffleDashboard`)
                break
        }
        console.log(`Command executed successfully: ${answer}`)
    } catch (error) {
        console.error(`Error executing command: ` + error)
    }
}

displayMenu()
