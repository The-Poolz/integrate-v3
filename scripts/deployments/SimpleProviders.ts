import { DealProvider, LockDealNFT, LockDealProvider, TimedDealProvider } from "../../typechain-types"
import { deploy } from "../utility/deployment"
import { setApprovedContracts } from "../utility/manageable"
import { ethers } from "hardhat"

export async function deploySimpleProviders(lockDealNFTAddress: string) {
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const lockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFTAddress) as any as LockDealNFT
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFTAddress)
    const lockProvider: LockDealProvider = await deploy(
        "LockDealProvider",
        lockDealNFTAddress,
        await dealProvider.getAddress()
    )
    const TimedDealProvider: TimedDealProvider = await deploy(
        "TimedDealProvider",
        lockDealNFTAddress,
        await lockProvider.getAddress()
    )

    console.log("SimpleProviders deployed successfully!")
    await setApprovedContracts(lockDealNFT, [
        await dealProvider.getAddress(),
        await lockProvider.getAddress(),
        await TimedDealProvider.getAddress(),
    ])
}

const lockDealNFTAddress = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deploySimpleProviders(lockDealNFTAddress)