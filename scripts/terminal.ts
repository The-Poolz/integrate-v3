const inquirer = require("inquirer")
const { exec } = require("child_process")

// Definition of menu items
const menuItems = [
    { name: "Deploy LockDealNFT and Vault Manager" },
    { name: "Deploy Simple Providers" },
    { name: "Deploy Refund Provider and Collateral Provider" },
    { name: "Deploy SimpleBuilder and SimpleRefundBuilder" },
    { name: "Deploy Delay Vault Provider and Delay Vault Migrator" },
    { name: "Deploy All contracts\n\n" },
]

function deployCommand(): void {
    console.log("Deploying...") // You can add deployment logic here
}

// Function to display the menu
async function displayMenu(): Promise<void> {
    const GREEN_TEXT = "\x1b[32m"
    const DEFAULT_TEXT = "\x1b[0m"
    const answer = (await inquirer.prompt([
        {
            type: "list",
            name: "menuItem",
            message: "Choose a menu item:",
            choices: menuItems,
        },
    ])) as { menuItem: string }

    // Handling the selection
    switch (answer.menuItem) {
        case menuItems[0].name:
            exec("npx hardhat run ./scripts/utility/deployment/VaultAndLockDealNFT.ts --network truffleDashboard")
            break
        case menuItems[1].name:
            exec("npx hardhat run ./scripts/utility/deployment/SimpleProviders.ts --network truffleDashboard")
            break
        case menuItems[2].name:
            exec("npx hardhat run ./scripts/utility/deployment/RefundAndCollateral.ts --network truffleDashboard")
            break
        case menuItems[3].name:
            exec("npx hardhat run ./scripts/utility/deployment/Builders.ts --network truffleDashboard")
            break
        case menuItems[4].name:
            break
        case menuItems[5].name:
            exec("npx hardhat run ./deploy.ts --network truffleDashboard")
            break
        default:
            break
    }
}

displayMenu()
