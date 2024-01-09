import { deploy } from "../deployment"
import { CollateralProvider } from "../../../typechain-types"

export async function deployRefundWithCollateral(lockDealNFT: string, provider: string) {
    const collateralProvider = (await deploy("CollateralProvider", lockDealNFT, provider)) as CollateralProvider
    await deploy("RefundProvider", lockDealNFT, collateralProvider.address)
}

// Retrieve environment variables
const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""
const provider = process.env.PROVIDER_ADDRESS || ""

deployRefundWithCollateral(lockDealNFT, provider)
