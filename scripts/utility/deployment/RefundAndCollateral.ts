import { CollateralProvider } from "../../../typechain-types"
import { deploy } from "../deployment"
import { deployRefundProvider } from "./RefundProvider"

export async function deployRefundWithCollateral(lockDealNFT: string, provider: string) {
    const collateralProvider: CollateralProvider = await deploy("CollateralProvider", lockDealNFT, provider)
    await deployRefundProvider(lockDealNFT, collateralProvider.address)
}

// Retrieve environment variables
const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""
const provider = process.env.PROVIDER_ADDRESS || ""
deployRefundWithCollateral(lockDealNFT, provider)
