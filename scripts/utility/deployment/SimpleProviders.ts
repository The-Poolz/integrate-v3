import { DealProvider, LockDealProvider } from "../../../typechain-types";
import { deploy } from "../deployment"

export async function deploySimpleProviders(lockDealNFT: string) {
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFT);
    const lockProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFT, dealProvider.address);
    await deploy("TimedDealProvider", lockDealNFT, lockProvider.address);

    console.log("SimpleProviders deployed successfully!");
}

const lockDealNFTAddress = process.env.LOCK_DEAL_NFT_ADDRESS || "";

deploySimpleProviders(lockDealNFTAddress);
