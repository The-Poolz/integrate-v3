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

async function executeScript(scriptName: string, scriptPath: string) {
    const network = "truffleDashboard"
    const command = `npx hardhat run ${scriptPath} --network ${network}`

    await execAsync(command)
    console.log(`Command executed successfully: Deploy ${scriptName}`)
}

export async function deployVaultAndLockDealNFT() {
    process.env.BASEURI = await getBaseURI()
    await executeScript("VaultAndLockDealNFT", "scripts/utility/deployment/VaultAndLockDealNFT.ts")
}

export async function deploySimpleProviders() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    await executeScript("SimpleProviders", "scripts/utility/deployment/SimpleProviders.ts")
}

export async function deployRefundProvider() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.COLLATERAL = await getCollateralProviderAddress()
    await executeScript("RefundProvider", "scripts/utility/deployment/RefundProvider.ts")
}

export async function deployRefundAndCollateral() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.PROVIDER_ADDRESS = await getDealProviderAddress()
    await executeScript("RefundAndCollateral", "scripts/utility/deployment/RefundAndCollateral.ts")
}

export async function deployLightMigrator() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.OLD_DELAY = await getOldDelay()
    process.env.NEW_DELAY = await getNewDelay()
    await executeScript("LightMigrator", "scripts/utility/deployment/LightMigrator.ts")
}

export async function deployBuilders() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.REFUND_PROVIDER_ADDRESS = await getRefundProviderAddress()
    process.env.COLLATERAL_PROVIDER_ADDRESS = await getCollateralProviderAddress()
    await executeScript("Builders", "scripts/utility/deployment/Builders.ts")
}

export async function deployDelayProviderAndMigrator() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress()
    process.env.V1_DELAY_VAULT = await getOldDelay()
    process.env.LOCK_PROVIDER = await getLockProviderAddress()
    await executeScript("DelayProviderAndMigrator", "scripts/utility/deployment/DelayVaultProvider.ts")
}

export async function deployAllContracts() {
    process.env.BASEURI = await getBaseURI()
    await executeScript("AllContracts", "scripts/utility/deployment/deploy.ts")
}

export async function deployWithoutRefund() {
    process.env.BASEURI = await getBaseURI()
    await executeScript("deploy core contracts without Refund", "scripts/withoutRefund.ts")
}
