import { LockDealNFT, SimpleBuilder } from "../../typechain-types"
import { deploy } from "../utility/deployment"
import { setApprovedContracts } from "../utility/manageable"
import { ethers } from "hardhat"

export async function deployBuilder(lockDealNFT: string) {
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const LockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFT) as any as LockDealNFT
    const simpleBuilder: SimpleBuilder = await deploy("SimpleBuilder", lockDealNFT)
    await setApprovedContracts(LockDealNFT, [await simpleBuilder.getAddress()])
}

const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deployBuilder(lockDealNFT)
