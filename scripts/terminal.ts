import {
    deployVaultAndLockDealNFT,
    deploySimpleProviders,
    deployRefundProvider,
    deployRefundAndCollateral,
    deployBuilders,
    deployAllContracts,
    deployLightMigrator,
    deployDelayProviderAndMigrator,
    deployWithoutRefund,
} from "./utility/deployment/execute"
import { getMenu } from "./utility/deployment/input"

// Define deployment scripts
const scriptPaths = [
    "withoutRefund.ts",
    "VaultAndLockDealNFT.ts",
    "SimpleProviders.ts",
    "RefundProvider.ts",
    "RefundAndCollateral.ts",
    "Builders.ts",
    "LightMigrator.ts",
    "DelayVaultProvider.ts",
]

// Create menu items from script paths
const menuItems = [
    { name: "Deploy All contracts" },
    ...scriptPaths.map((script) => ({ name: `Deploy ${script.replace(".ts", "")}` })),
    { name: "Open and Submit GitHub Issue" }, // Combined menu item for opening and submitting an issue
]

// Map menu item names to deployment functions for cleaner handling
const deploymentActions: { [key: string]: () => Promise<void> } = {
    "Deploy All contracts": deployAllContracts,
    "Deploy withoutRefund": deployWithoutRefund,
    "Deploy VaultAndLockDealNFT": deployVaultAndLockDealNFT,
    "Deploy SimpleProviders": deploySimpleProviders,
    "Deploy RefundProvider": deployRefundProvider,
    "Deploy RefundAndCollateral": deployRefundAndCollateral,
    "Deploy Builders": deployBuilders,
    "Deploy LightMigrator": deployLightMigrator,
    "Deploy DelayVaultProvider": deployDelayProviderAndMigrator
}

async function displayMenu() {
    let keepMenuOpen = true

    while (keepMenuOpen) {
        try {
            const answer = await getMenu(menuItems)

            if (deploymentActions[answer]) {
                await deploymentActions[answer]()
            } else {
                console.log("Exiting the menu. Thank you!")
                keepMenuOpen = false
            }
        } catch (error) {
            console.error(`Error executing command: ${error}`)
        }
    }
}

displayMenu()
