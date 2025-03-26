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
import { askYesNoQuestion, openAndSubmitGitHubIssue, getDataByChainId } from "./utility/issues"
import { ethers } from "ethers"

// Define deployment scripts
const scriptPaths = [
    "DispenserProvider.ts",
    "InvestProvider.ts",
    "SimpleBuilder.ts",
    "SimpleProviders.ts",
    "VaultAndLockDealNFT.ts",
    "withoutDispenser.ts",
]

// Create menu items from script paths
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

// Map menu item names to deployment functions for cleaner handling
const deploymentActions: { [key: string]: () => Promise<any> } = {
    "Deploy All contracts": deployAllContracts,
    "Deploy DispenserProvider": deployDispenser,
    "Deploy InvestProvider": deployInvestProvider,
    "Deploy withoutDispenser": deployWithoutDispenser,
    "Deploy VaultAndLockDealNFT": deployVaultAndLockDealNFT,
    "Deploy SimpleProviders": deploySimpleProviders,
    "Deploy SimpleBuilder": deployBuilder,
}
async function displayMenu() {
    let keepMenuOpen = true
    while (keepMenuOpen) {
        try {
            const answer = await getMenu(menuItems)
            if (deploymentActions[answer]) {
                const deploymentData = await deploymentActions[answer]()
                const openIssue = await askYesNoQuestion("Do you want to open an issue with deployment data?")
                if (openIssue) {
                    const provider = new ethers.JsonRpcProvider("http://localhost:24012/rpc")
                    const network = await provider.getNetwork()
                    const data = await getDataByChainId(Number(network.chainId))

                    // Prepare the issue body with deployment data and RPCs
                    const issueBody = `**Chain:** ${data?.name}\n**ChainId:** ${network.chainId}\n**RPC:** ${
                        data?.rpc[0]?.url
                    }\n**Explorer:** ${data?.explorers
                        .map((explorer: any) => explorer.url)
                        .join(", ")}\nNative Currency: ${data?.nativeCurrency.name} (${
                        data?.nativeCurrency.symbol
                    })\nFaucets: ${data?.faucets.join(
                        ", "
                    )}\n\nThe following contracts were deployed successfully:\n\n${deploymentData
                        .map((address: string) => `- ${address}`)
                        .join("\n")}
                        `
                    await openAndSubmitGitHubIssue(answer + " to " + data?.name, issueBody)
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
