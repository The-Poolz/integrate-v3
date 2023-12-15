import { LockDealNFT, DealProvider, LockDealProvider } from "../../../typechain-types"
import { deploy } from "../../deploy"

export async function deploySimpleProviders(lockDealNFT: LockDealNFT) {
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFT.address)
    const lockProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFT.address, dealProvider.address)
    await deploy("TimedDealProvider", lockDealNFT.address, lockProvider.address)
}