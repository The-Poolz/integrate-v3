import { askYesNoQuestion, openAndSubmitGitHubIssue } from "./deployments/issues"
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
            // Display the main menu to choose deployment options
            const answer = await getMenu(menuItems)
            console.log(`Selected: ${answer}`)
            console.log("deploymentActions[answer]:", deploymentActions[answer])
            if (deploymentActions[answer]) {
                // Capture the deployment addresses
                const deploymentData = await deploymentActions[answer]()

                // Ask if the user wants to create an issue with deployment data
                const openIssue = await askYesNoQuestion("Do you want to open an issue with deployment data?")

                if (openIssue) {
                    const provider = new ethers.JsonRpcProvider("http://localhost:24012/rpc")
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
                //console.log("Exiting the menu. Thank you!")
                //keepMenuOpen = false
            }
        } catch (error) {
            console.error(`Error executing command: ${error}`)
        }
    }
}

displayMenu()
