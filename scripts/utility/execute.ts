import { execSync } from "child_process";
import { getBaseURI, getLockDealNFTAddress, getDispenserProviderAddress } from "./input";

async function executeScript(scriptName: string, scriptPath: string) {
    const network = "truffleDashboard";
    const command = `npx hardhat run ${scriptPath} --network ${network}`;

    try {
        await execSync(command, { stdio: "inherit" });
        console.log(`Command executed successfully: Deploy ${scriptName}`);
    } catch (error) {
        console.error(`Error executing ${scriptName}:`, error);
        throw error;
    }
}

export async function deployVaultAndLockDealNFT() {
    process.env.BASEURI = await getBaseURI();
    await executeScript("VaultAndLockDealNFT", "scripts/deployments/VaultAndLockDealNFT.ts");
}

export async function deploySimpleProviders() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("SimpleProviders", "scripts/deployments/SimpleProviders.ts");
}

export async function deployBuilder() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("Simple Builder", "scripts/deployments/Builder.ts");
}

export async function deployAllContracts() {
    process.env.BASEURI = await getBaseURI();
    await executeScript("AllContracts", "scripts/deployments/deploy.ts");
}

export async function deployWithoutDispenser() {
    process.env.BASEURI = await getBaseURI();
    await executeScript("deploy core contracts without Dispenser", "scripts/deployments/withoutDispenser.ts");
}

export async function deployDispenser() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("deploy DispenserProvider", "scripts/deployments/DispenserProvider.ts");
}

export async function upgrade() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("update contracts from 1.3 to 1.4", "scripts/deployments/upgrade.ts");
}

export async function deployInvestProvider() {
    process.env.DISPENSER_PROVIDER_ADDRESS = await getDispenserProviderAddress();
    await executeScript("InvestProvider", "scripts/deployments/InvestProvider.ts");
}
