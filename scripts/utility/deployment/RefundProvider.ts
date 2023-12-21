import { deploy } from "../deployment"

export async function deployRefundProvider(lockDealNFT: string, collateralProvider: string) {
    await deploy("RefundProvider", lockDealNFT, collateralProvider)
}

// Retrieve environment variables
const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""
const provider = process.env.COLLATERAL || ""
deployRefundProvider(lockDealNFT, provider)