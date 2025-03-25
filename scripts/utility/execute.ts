import { getBaseURI, getLockDealNFTAddress, getDispenserProviderAddress } from "./input"
import { execSync } from "child_process"

async function executeScript(scriptName: string, scriptPath: string): Promise<string[]> {
    const network = "truffleDashboard"
    const command = `npx hardhat run ${scriptPath} --network ${network}`

    try {
        const stdout = await execSync(command, { stdio: "inherit" }).toString()
        console.log(`Command executed successfully: Deploy ${scriptName}`)

        // Split the output by lines and skip the first three lines
        return stdout.split("\n").slice(3)
    } catch (error) {
        console.error(`Error executing script ${scriptName}:`, error)
        return []
    }
}

export async function deployVaultAndLockDealNFT(): Promise<string[]> {
    process.env.BASEURI = await getBaseURI()
    return await executeScript("VaultAndLockDealNFT", "scripts/deployments/VaultAndLockDealNFT.ts")
}

export async function deploySimpleProviders(): Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    return await executeScript("SimpleProviders", "scripts/deployments/SimpleProviders.ts")
}

export async function deployBuilder(): Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    return await executeScript("Simple Builder", "scripts/deployments/SimpleBuilder.ts")
}

export async function deployAllContracts(): Promise<string[]> {
    process.env.BASEURI = await getBaseURI()
    return await executeScript("AllContracts", "scripts/deployments/deploy.ts")
}

export async function deployWithoutDispenser(): Promise<string[]> {
    process.env.BASEURI = await getBaseURI()
    return await executeScript("deploy core contracts without Dispenser", "scripts/deployments/withoutDispenser.ts")
}

export async function deployDispenser(): Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    return await executeScript("deploy DispenserProvider", "scripts/deployments/DispenserProvider.ts")
}

export async function upgrade(): Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    return await executeScript("update contracts from 1.3 to 1.4", "scripts/deployments/upgrade.ts")
}

export async function deployInvestProvider(): Promise<string[]> {
    process.env.DISPENSER_PROVIDER_ADDRESS = await getDispenserProviderAddress()
    return await executeScript("InvestProvider", "scripts/deployments/InvestProvider.ts")
}
