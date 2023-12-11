import {
    LockDealNFT,
    CollateralProvider,
    RefundProvider
} from "../typechain-types"
import { deployed } from "./helper"

export async function deployBuilders(lockDealNFT: LockDealNFT, refundProvider: RefundProvider, collateralProvider: CollateralProvider) {
    await deployed("SimpleBuilder", lockDealNFT.address)
    await deployed("SimpleRefundBuilder", lockDealNFT.address, refundProvider.address, collateralProvider.address)
}
