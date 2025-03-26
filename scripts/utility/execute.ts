import { getBaseURI, getLockDealNFTAddress, getDispenserProviderAddress } from "./input"
import { execSync } from "child_process"

async function executeScript(scriptName: string, scriptPath: string): Promise<string[]> {
    const network = "truffleDashboard"
    const command = `npx hardhat run ${scriptPath} --network ${network}`

    try {
        const stdout = execSync(command, { stdio: "pipe" }).toString()
        if (!stdout) {
            throw new Error("No output from command")
        }

        console.log(`Command executed successfully: Deploy ${scriptName}`)
        console.log(stdout)
        // Split the output by lines and skip the first four lines
        return filterEvenLengthStrings(stdout.split("\n").slice(4))
    } catch (error: any) {
        // Cast error to any
        console.error(`Error executing script ${scriptName}:`, error)
        // Capture stderr if available
        if (error.stderr) {
            console.error("Error Output:", error.stderr.toString())
        }
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

function filterEvenLengthStrings(arr: string[]): string[] {
    return arr.filter((str) => str.length % 2 === 0)
}
