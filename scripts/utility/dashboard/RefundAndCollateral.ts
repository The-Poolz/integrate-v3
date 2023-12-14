import { CollateralProvider, LockDealNFT, DealProvider } from "../../../typechain-types"
import { deploy } from "../../deploy"

export async function deployRefundWithCollateral(lockDealNFT: LockDealNFT, dealProvider: DealProvider) {
    const collateralProvider: CollateralProvider = await deploy(
        "CollateralProvider",
        lockDealNFT.address,
        dealProvider.address
    )
    await deploy("RefundProvider", lockDealNFT.address, collateralProvider.address)
}
