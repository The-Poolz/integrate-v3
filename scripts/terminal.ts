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
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

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

// GitHub API details
const GITHUB_API_URL = "https://api.github.com/repos/The-Poolz/PoolzReactHelper/issues"

async function openAndSubmitGitHubIssue(title: string, body: string) {
    try {
        // Submit the issue via the GitHub API
        const response = await axios.post(
            GITHUB_API_URL,
            {
                title: title,
                body: body,
            },
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        )
        console.log(`Issue created successfully: ${response.data.html_url}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error creating GitHub issue: ${error.response?.data.message}`)
        } else if (error instanceof Error) {
            console.error(`Error creating GitHub issue: ${error.message}`)
        } else {
            console.error(`Unknown error occurred: ${JSON.stringify(error)}`)
        }
    }
}

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
    "Deploy DelayVaultProvider": deployDelayProviderAndMigrator,
    "Open and Submit GitHub Issue": async () => {
        await openAndSubmitGitHubIssue("test", "This is a test issue created by the deployment script.")
    },
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
