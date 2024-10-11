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
import { ethers } from "ethers"
import { getMenu } from "./utility/deployment/input"
import { askYesNoQuestion, openAndSubmitGitHubIssue } from "./utility/deployment/issues"

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
]

// Map menu item names to deployment functions for cleaner handling
const deploymentActions: { [key: string]: () => Promise<any> } = {
    "Deploy All contracts": deployAllContracts,
    "Deploy withoutRefund": deployWithoutRefund,
    "Deploy VaultAndLockDealNFT": deployVaultAndLockDealNFT,
    "Deploy SimpleProviders": deploySimpleProviders,
    "Deploy RefundProvider": deployRefundProvider,
    "Deploy RefundAndCollateral": deployRefundAndCollateral,
    "Deploy Builders": deployBuilders,
    "Deploy LightMigrator": deployLightMigrator,
    "Deploy DelayVaultProvider": deployDelayProviderAndMigrator,
}

async function displayMenu() {
    let keepMenuOpen = true
    while (keepMenuOpen) {
        try {
            // Display the main menu to choose deployment options
            const answer = await getMenu(menuItems)

            if (deploymentActions[answer]) {
                // Capture the deployment addresses
                const deploymentData = await deploymentActions[answer]()

                // Ask if the user wants to create an issue with deployment data
                const openIssue = await askYesNoQuestion("Do you want to open an issue with deployment data?")

                if (openIssue) {
                    const provider = new ethers.providers.JsonRpcProvider("http://localhost:24012/rpc")
                    const network = await provider.getNetwork()
                    // Prepare the issue body with the deployment data
                    const issueBody = `This issue is created by the deployment script.\nThe following contracts were deployed successfully:\n\n${deploymentData
                        .map((address: string) => `- ${address}`)
                        .join("\n")}\nchain: ${network.name}\nchainId: ${network.chainId}`
                    console.log("Issue body:", issueBody)
                    await openAndSubmitGitHubIssue("test issue", issueBody)
                    console.log("Issue created successfully.")
                } else {
                    console.log("Issue creation skipped.")
                }
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
