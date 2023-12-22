// scriptDeployer.js
import { exec } from "child_process";
import util from "util";
import {
    getBaseURI,
    getLockDealNFTAddress,
    getCollateralProviderAddress,
    getDealProviderAddress,
    getOldDelay,
    getNewDelay,
} from "./input";

const execAsync = util.promisify(exec);

async function executeScript(scriptName: string, scriptPath: string) {
    const network = "truffleDashboard";
    const command = `npx hardhat run ${scriptPath} --network ${network}`;

    await execAsync(command);
    console.log(`Command executed successfully: Deploy ${scriptName}`);
}

export async function deployVaultAndLockDealNFT() {
    process.env.BASEURI = await getBaseURI();
    await executeScript("VaultAndLockDealNFT", "scripts/utility/deployment/VaultAndLockDealNFT.ts");
}

export async function deploySimpleProviders() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("SimpleProviders", "scripts/utility/deployment/SimpleProviders.ts");
}

export async function deployRefundProvider() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    process.env.COLLATERAL = await getCollateralProviderAddress();
    await executeScript("RefundProvider", "scripts/utility/deployment/RefundProvider.ts");
}

export async function deployRefundAndCollateral() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    process.env.PROVIDER_ADDRESS = await getDealProviderAddress();
    await executeScript("RefundAndCollateral", "scripts/utility/deployment/RefundAndCollateral.ts");
}

export async function deployLightMigrator() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    process.env.OLD_DELAY = await getOldDelay();
    process.env.NEW_DELAY = await getNewDelay();
    await executeScript("LightMigrator", "scripts/utility/deployment/LightMigrator.ts");
}
