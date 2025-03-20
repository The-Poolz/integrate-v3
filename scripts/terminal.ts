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
    { name: "Deploy All contracts" },
    { name: "Upgrade from v1.3 to v1.4" },
    ...scriptPaths.map((script) => ({ name: `Deploy ${script.replace(".ts", "")}` })),
    { name: "Exit" }, // Add Exit option here
]

async function displayMenu() {
    let keepMenuOpen = true

    // Menu loop
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
                case menuItems[7].name:
                    await deployInvestProvider()
                    break
                case menuItems[8].name: // Exit case
                    console.log("Exiting...")
                    keepMenuOpen = false
                    break
                default:
                    console.log("Invalid option selected, exiting menu...")
                    keepMenuOpen = false
                    break
            }
        } catch (error) {
            console.error(`Error executing command: ${error}`)
            process.exit(1) // Exit with error code in case of failure
        }
    }
}

displayMenu()
