import {
    deployVaultAndLockDealNFT,
    deploySimpleProviders,
    deployBuilder,
    deployAllContracts,
    deployWithoutDispenser,
    deployDispenser,
    deployInvestProvider,
    upgrade,
} from "./utility/execute"
import { getMenu } from "./utility/input"

const scriptPaths = [
    "DispenserProvider.ts",
    "Builder.ts",
    "SimpleProviders.ts",
    "VaultAndLockDealNFT.ts",
    "withoutDispenser.ts",
    "InvestProvider.ts",
]

const menuItems = [
    { name: "Deploy All contracts", action: deployAllContracts },
    { name: "Upgrade from v1.3 to v1.4", action: upgrade },
    ...scriptPaths.map((script, index) => ({
        name: `Deploy ${script.replace(".ts", "")}`,
        action: [
            deployDispenser,
            deployBuilder,
            deploySimpleProviders,
            deployVaultAndLockDealNFT,
            deployWithoutDispenser,
            deployInvestProvider,
        ][index], // Map functions dynamically
    })),
    { name: "Exit", action: () => console.log("Exiting...") },
]

async function displayMenu() {
    let keepMenuOpen = true

    while (keepMenuOpen) {
        try {
            const answer = await getMenu(menuItems)
            const selectedItem = menuItems.find((item) => item.name === answer)

            if (selectedItem) {
                if (selectedItem.name === "Exit") {
                    keepMenuOpen = false
                } else {
                    await selectedItem.action()
                }
            } else {
                console.log("Invalid option selected. Please try again.")
            }
        } catch (error) {
            console.error(`Error executing command: ${error}`)
            process.exit(1)
        }
    }
}

displayMenu()
