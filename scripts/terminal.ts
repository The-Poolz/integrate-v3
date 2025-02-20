import {
    deployVaultAndLockDealNFT,
    deploySimpleProviders,
    deployBuilder,
    deployAllContracts,
    deployWithoutDispenser,
    deployDispenser,
    upgrade,
} from "./utility/deployment/execute"
import { getMenu } from "./utility/deployment/input"

const scriptPaths = [
    "DispenserProvider.ts",
    "Builder.ts",
    "SimpleProviders.ts",
    "VaultAndLockDealNFT.ts",
    "withoutDispenser.ts",
]

const menuItems = [
    { name: "Deploy All contracts" },
    { name: "Upgrade from v1.3 to v1.4" },
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
                    await upgrade()
                    break
                case menuItems[2].name:
                    await deployDispenser()
                    break
                case menuItems[3].name:
                    await deployBuilder()
                    break
                case menuItems[4].name:
                    await deploySimpleProviders()
                    break
                case menuItems[5].name:
                    await deployVaultAndLockDealNFT()
                    break
                case menuItems[6].name:
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
