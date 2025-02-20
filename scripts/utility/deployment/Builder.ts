import { LockDealNFT } from "../../../typechain-types"
import { deploy } from "../deployment"
import { ethers } from "hardhat"

export async function deployBuilder(lockDealNFT: string) {
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const LockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFT) as LockDealNFT
    await deploy("SimpleBuilder", lockDealNFT)
    await LockDealNFT.setApprovedContract(lockDealNFT, true)
}

const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deployBuilder(lockDealNFT)
