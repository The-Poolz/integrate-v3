import { deploy } from "../deployment"

export async function deployBuilders(
    lockDealNFT: string,
    refundProvider: string,
    collateralProvider: string
) {
    await deploy("SimpleBuilder", lockDealNFT)
    await deploy("SimpleRefundBuilder", lockDealNFT, refundProvider, collateralProvider)
}

const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""
const refundProvider = process.env.REFUND_PROVIDER_ADDRESS || ""
const collateralProvider = process.env.COLLATERAL_PROVIDER_ADDRESS || ""

deployBuilders(lockDealNFT, refundProvider, collateralProvider)