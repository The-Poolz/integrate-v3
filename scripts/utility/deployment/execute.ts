// scriptDeployer.js
import {
    getBaseURI,
    getLockDealNFTAddress,
    getCollateralProviderAddress,
    getDealProviderAddress,
    getLockProviderAddress,
    getOldDelay,
    getNewDelay,
    getRefundProviderAddress,
} from "./input"
import { exec } from "child_process"
import util from "util"

const execAsync = util.promisify(exec)

async function executeScript(scriptName: string, scriptPath: string): Promise<string[]> {
    const network = "truffleDashboard"
    const command = `npx hardhat run ${scriptPath} --network ${network}`

    try {
        const { stdout } = await execAsync(command)
        console.log(`Command executed successfully: Deploy ${scriptName}`)

        // Split the output by lines and skip the first three lines
        return stdout.split("\n").slice(3)
    } catch (error) {
        console.error(`Error executing script ${scriptName}:`, error)
        return []
    }
}

export async function deployVaultAndLockDealNFT() : Promise<string[]> {
    process.env.BASEURI = await getBaseURI()
    return await executeScript("VaultAndLockDealNFT", "scripts/utility/deployment/VaultAndLockDealNFT.ts")
}

export async function deploySimpleProviders() : Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    return await executeScript("SimpleProviders", "scripts/utility/deployment/SimpleProviders.ts")
}

export async function deployRefundProvider() : Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.COLLATERAL = await getCollateralProviderAddress()
    return await executeScript("RefundProvider", "scripts/utility/deployment/RefundProvider.ts")
}

export async function deployRefundAndCollateral() : Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.PROVIDER_ADDRESS = await getDealProviderAddress()
    return await executeScript("RefundAndCollateral", "scripts/utility/deployment/RefundAndCollateral.ts")
}

export async function deployLightMigrator() : Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.OLD_DELAY = await getOldDelay()
    process.env.NEW_DELAY = await getNewDelay()
    return await executeScript("LightMigrator", "scripts/utility/deployment/LightMigrator.ts")
}

export async function deployBuilders() : Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.REFUND_PROVIDER_ADDRESS = await getRefundProviderAddress()
    process.env.COLLATERAL_PROVIDER_ADDRESS = await getCollateralProviderAddress()
    return await executeScript("Builders", "scripts/utility/deployment/Builders.ts")
}

export async function deployDelayProviderAndMigrator() : Promise<string[]> {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.V1_DELAY_VAULT = await getOldDelay()
    process.env.LOCK_PROVIDER = await getLockProviderAddress()
    return await executeScript("DelayProviderAndMigrator", "scripts/utility/deployment/DelayVaultProvider.ts")
}

export async function deployAllContracts() : Promise<string[]> {
    process.env.BASEURI = await getBaseURI()
    return await executeScript("AllContracts", "scripts/utility/deployment/deploy.ts")
}

export async function deployWithoutRefund() : Promise<string[]> {
    process.env.BASEURI = await getBaseURI()
    return await executeScript("deploy core contracts without Refund", "scripts/withoutRefund.ts")
}
