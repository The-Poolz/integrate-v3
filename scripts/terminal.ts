import { getMenu } from "./utility/deployment/input"
import {
    deployVaultAndLockDealNFT,
    deploySimpleProviders,
    deployBuilder,
    deployAllContracts,
    deployWithoutDispenser,
    deployDispenser
} from "./utility/deployment/execute"

const scriptPaths = [
    "withoutDispenser.ts",
    "VaultAndLockDealNFT.ts",
    "SimpleProviders.ts",
    "Builders.ts",
    "DispenserProvider.ts",
]

const menuItems = [
    { name: "Deploy All contracts" },
    ...scriptPaths.map((script) => ({ name: `Deploy ${script.replace(".ts", "")}` })),
]

async function displayMenu() {
    let keepMenuOpen = true

    while (keepMenuOpen) {
        try {
            const answer = await getMenu(menuItems)

            switch (answer) {
                case "Deploy All contracts":
                    await deployAllContracts()
                    break
                case menuItems[1].name:
                    await deployVaultAndLockDealNFT()
                    break
                case menuItems[2].name:
                    await deploySimpleProviders()
                    break
                case menuItems[3].name:
                    await deployBuilder()
                    break
                case menuItems[4].name:
                    await deployDispenser()
                    break
                case menuItems[5].name:
                    await deployWithoutDispenser()
                    break
                default:
                    // Exit the loop if an invalid option is selected
                    keepMenuOpen = false
                    break
            }
        } catch (error) {
            console.error(`Error executing command: ${error}`)
        }
    }
}

displayMenu()
