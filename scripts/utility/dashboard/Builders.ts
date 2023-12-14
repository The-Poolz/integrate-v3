import { LockDealNFT, RefundProvider, CollateralProvider } from "../../../typechain-types"
import { deploy } from "../../deploy"

export async function deployBuilders(
    lockDealNFT: LockDealNFT,
    refundProvider: RefundProvider,
    collateralProvider: CollateralProvider
) {
    await deploy("SimpleBuilder", lockDealNFT.address)
    await deploy("SimpleRefundBuilder", lockDealNFT.address, refundProvider.address, collateralProvider.address)
}
