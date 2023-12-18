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
            default: "", // You can set a default value if needed
        },
    ])
    return answer.baseURI
}

async function displayMenu() {
    const answer = (await inquirer.prompt([
        {
            type: "list",
            name: "menuItem",
            message: "Choose a menu item:",
            choices: menuItems,
        },
    ])) as { menuItem: string }

    try {
        if (answer.menuItem === menuItems[0].name) {
            const baseURI = await getBaseURI()
            process.env.BASEURI = baseURI
            await execAsync(
                `npx hardhat run scripts/utility/deployment/VaultAndLockDealNFT.ts --network truffleDashboard`
            )
        } else if (answer.menuItem === "Deploy All contracts\n\n") {
            await execAsync("npx hardhat run scripts/deploy.ts --network truffleDashboard")
        } else {
            // Deploy the selected script
            const scriptName = answer.menuItem.replace("Deploy ", "")
            const scriptPath = path.join("scripts", "utility", "deployment", `${scriptName}.ts`)
            await execAsync(`npx hardhat run ${scriptPath} --network truffleDashboard`)
        }
        console.log(`Command executed successfully: ${answer.menuItem}`)
    } catch (error) {
        console.error(`Error executing command: ` + error)
    }
}

displayMenu()
