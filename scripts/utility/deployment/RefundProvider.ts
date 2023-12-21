import { deploy } from "../deployment"

export async function deployRefundProvider(lockDealNFT: string, collateralProvider: string) {
    await deploy("RefundProvider", lockDealNFT, collateralProvider)
}
