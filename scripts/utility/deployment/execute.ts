// scriptDeployer.js
import { exec } from "child_process";
import util from "util";
import { getBaseURI, getLockDealNFTAddress } from "./input";

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

export async function deployBuilder() {
    process.env.LOCK_DEAL_NFT_ADDRESS = await getLockDealNFTAddress();
    await executeScript("Simple Builder", "scripts/utility/deployment/Builders.ts");
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
    process.env.BASEURI = await getBaseURI();
    await executeScript("deploy DispenserProvider", "scripts/DispenserProvider.ts");
}