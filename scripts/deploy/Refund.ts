import {
    LockDealNFT,
    DealProvider,
    CollateralProvider,
} from "../typechain-types"
import { deployed } from "./helper"

export async function deployAllContracts(lockDealNFT: LockDealNFT, dealProvider: DealProvider) {
    const collateralProvider: CollateralProvider = await deployed(
        "CollateralProvider",
        lockDealNFT.address,
        dealProvider.address
    )
    await deployed(
        "RefundProvider",
        lockDealNFT.address,
        collateralProvider.address
    )
}