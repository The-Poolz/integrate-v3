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
        if (answer.menuItem === "Deploy All contracts\n\n") {
            await execAsync("npx hardhat run ./deploy.ts --network truffleDashboard")
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
