const inquirer = require("inquirer")
const util = require("util")
const path = require("path")
const { exec } = require("child_process")

const execAsync = util.promisify(exec)

const scriptPaths = ["VaultAndLockDealNFT.ts", "SimpleProviders.ts", "RefundAndCollateral.ts", "Builders.ts"]

const menuItems = [
    ...scriptPaths.map((script) => ({ name: `Deploy ${script.replace(".ts", "")}` })),
    { name: "Deploy All contracts\n\n" },
]

async function getBaseURI() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "baseURI",
            message: "Enter the baseURI for NFT deployment:",
            default: "",
        },
    ])
    return answer.baseURI
}

async function getLockDealNFTAddress() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "lockDealNFTAddress",
            message: "Enter the LockDealNFT address for deployment:",
        },
    ])
    return answer.lockDealNFTAddress
}

async function getDealProviderAddress() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "providerAddress",
            message: "Enter the Deal Provider address for deployment:",
        },
    ])
    return answer.providerAddress
}

async function displayMenu() {
    try {
        const answer = await inquirer.prompt([
            {
                type: "list",
                name: "menuItem",
                message: "Choose a menu item:",
                choices: menuItems,
            },
        ])

        switch (answer.menuItem) {
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
            case "Deploy All contracts\n\n":
                await execAsync("npx hardhat run scripts/deploy.ts --network truffleDashboard")
                break
            default:
                // Deploy the selected script
                const scriptName = answer.menuItem.replace("Deploy ", "")
                const scriptPath = path.join("scripts", "utility", "deployment", `${scriptName}.ts`)
                await execAsync(`npx hardhat run ${scriptPath} --network truffleDashboard`)
                break
        }
        console.log(`Command executed successfully: ${answer.menuItem}`)
    } catch (error) {
        console.error(`Error executing command: ` + error)
    }
}

displayMenu()
