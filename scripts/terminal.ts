import { getMenu } from "./utility/deployment/input"
import {
    deployVaultAndLockDealNFT,
    deploySimpleProviders,
    deployRefundProvider,
    deployRefundAndCollateral,
    deployBuilders,
    deployAllContracts,
    deployLightMigrator,
    deployDelayProviderAndMigrator,
    deployWithoutRefund
} from "./utility/deployment/execute"

const scriptPaths = [
    "withoutRefund.ts",
    "VaultAndLockDealNFT.ts",
    "SimpleProviders.ts",
    "RefundProvider.ts",
    "RefundAndCollateral.ts",
    "Builders.ts",
    "LightMigrator.ts",
    "DelayVaultProvider.ts"
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
                    await deployWithoutRefund()
                    break
                case menuItems[2].name:
                    await deployVaultAndLockDealNFT()
                    break
                case menuItems[3].name:
                    await deploySimpleProviders()
                    break
                case menuItems[4].name:
                    await deployRefundProvider()
                    break
                case menuItems[5].name:
                    await deployRefundAndCollateral()
                    break
                case menuItems[6].name:
                    await deployBuilders()
                    break
                case menuItems[7].name:
                    await deployLightMigrator()
                    break
                case menuItems[8].name:
                    await deployDelayProviderAndMigrator()
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
