import { getMenu } from "./utility/deployment/input"

import {
    deployVaultAndLockDealNFT,
    deploySimpleProviders,
    deployRefundProvider,
    deployRefundAndCollateral,
    deployLightMigrator,
    deployBuilders,
    deployAllContracts,
    deployDelayProviderAndMigrator,
} from "./utility/deployment/execute"

const scriptPaths = [
    "VaultAndLockDealNFT.ts",
    "SimpleProviders.ts",
    "RefundProvider.ts",
    "RefundAndCollateral.ts",
    "Builders.ts",
    "LightMigrator.ts",
    "DelayVaultProvider.ts",
]

const menuItems = [
    { name: "Deploy All contracts" },
    ...scriptPaths.map((script) => ({ name: `Deploy ${script.replace(".ts", "")}` })),
]

async function displayMenu() {
    try {
        const answer = await getMenu(menuItems)

        switch (answer) {
            case menuItems[0].name:
                await deployVaultAndLockDealNFT()
                break
            case menuItems[1].name:
                await deploySimpleProviders()
                break
            case menuItems[2].name:
                await deployRefundProvider()
                break
            case menuItems[3].name:
                await deployRefundAndCollateral()
                break
            case menuItems[4].name:
                await deployBuilders()
                break
            case menuItems[5].name:
                await deployLightMigrator()
                break
            case menuItems[6].name:
                await deployDelayProviderAndMigrator()
                break
            case "Deploy All contracts":
                await deployAllContracts()
                break
        }

        console.log(`Command executed successfully: ${answer}`)
    } catch (error) {
        console.error(`Error executing command: ${error}`)
    }
}

displayMenu()
