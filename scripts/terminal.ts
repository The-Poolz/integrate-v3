import { getMenu } from "./utility/deployment/input"

import {
    deployVaultAndLockDealNFT,
    deploySimpleProviders,
    deployRefundProvider,
    deployRefundAndCollateral,
    deployLightMigrator,
    deployBuilders,
} from "./utility/deployment/execute"

const scriptPaths = [
    "VaultAndLockDealNFT.ts",
    "SimpleProviders.ts",
    "RefundProvider.ts",
    "RefundAndCollateral.ts",
    "Builders.ts",
    "LightMigrator.ts",
]

const menuItems = scriptPaths.map((script) => ({ name: `Deploy ${script.replace(".ts", "")}` }))
menuItems.push({ name: "Deploy All contracts" })

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
            case "Deploy All contracts":
                break
        }

        console.log(`Command executed successfully: ${answer}`)
    } catch (error) {
        console.error(`Error executing command: ${error}`)
    }
}

displayMenu()
