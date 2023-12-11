import {
    LockDealNFT,
    DealProvider,
    LockDealProvider
} from "../typechain-types"
import { deployed } from "./helper"

export async function deploySimpleProviders(lockDealNFT: LockDealNFT) {
    const dealProvider: DealProvider = await deployed("DealProvider", lockDealNFT.address)
    const lockProvider: LockDealProvider = await deployed("LockDealProvider", lockDealNFT.address, dealProvider.address)
    await deployed("TimedDealProvider", lockDealNFT.address, lockProvider.address)
}
