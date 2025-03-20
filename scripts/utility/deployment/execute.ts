// scriptDeployer.js
import { exec } from "child_process";
import { getBaseURI, getLockDealNFTAddress, getDealProviderAddress, getDispenserProviderAddress } from "./input";

async function executeScript(scriptName: string, scriptPath: string) {
    const network = "truffleDashboard";
    const command = `npx hardhat run ${scriptPath} --network ${network}`;

    await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ${scriptName}:`, stderr);
                reject(error);
            } else {
                console.log(stdout);
                console.log(`Command executed successfully: Deploy ${scriptName}`);
                resolve(null);
            }
        });
    });
}

export async function deployVaultAndLockDealNFT() {
    process.env.BASEURI = await getBaseURI();
    await executeScript("VaultAndLockDealNFT", "scripts/utility/deployment/VaultAndLockDealNFT.ts");
}

export async function deploySimpleProviders() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("SimpleProviders", "scripts/utility/deployment/SimpleProviders.ts");
}

export async function deployBuilder() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("Simple Builder", "scripts/utility/deployment/Builder.ts");
}

export async function deployAllContracts() {
    process.env.BASEURI = await getBaseURI();
    await executeScript("AllContracts", "scripts/deploy.ts");
}

export async function deployWithoutDispenser() {
    process.env.BASEURI = await getBaseURI();
    await executeScript("deploy core contracts without Dispenser", "scripts/withoutDispenser.ts");
}

export async function deployDispenser() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("deploy DispenserProvider", "scripts/utility/deployment/DispenserProvider.ts");
}

export async function upgrade() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("update contracts from 1.3 to 1.4", "scripts/utility/deployment/upgrade.ts");
}

export async function deployInvestProvider() {
    process.env.DISPENSER_PROVIDER_ADDRESS = await getDispenserProviderAddress();
    await executeScript("InvestProvider", "scripts/utility/deployment/InvestProvider.ts");
}
