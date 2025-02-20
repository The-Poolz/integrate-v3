import { DealProvider, LockDealNFT, LockDealProvider, TimedDealProvider } from "../../../typechain-types"
import { deploy } from "../deployment"
import { setApprovedContracts } from "../manageable"
import { ethers } from "hardhat"

export async function deploySimpleProviders(lockDealNFTAddress: string) {
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const lockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFTAddress) as LockDealNFT
    const dealProvider: DealProvider = await deploy("DealProvider", lockDealNFTAddress)
    const lockProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFTAddress, dealProvider.address)
    const TimedDealProvider: TimedDealProvider = await deploy(
        "TimedDealProvider",
        lockDealNFTAddress,
        lockProvider.address
    )

    console.log("SimpleProviders deployed successfully!")
    await setApprovedContracts(lockDealNFT, [dealProvider.address, lockProvider.address, TimedDealProvider.address])
}

const lockDealNFTAddress = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deploySimpleProviders(lockDealNFTAddress)
