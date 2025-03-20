import { LockDealNFT, SimpleBuilder } from "../../typechain-types"
import { deploy } from "../utility/deployment"
import { ethers } from "hardhat"

export async function deployBuilder(lockDealNFT: string) {
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const LockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFT) as any as LockDealNFT
    const simpleBuilder: SimpleBuilder = await deploy("SimpleBuilder", lockDealNFT)
    const tx = await LockDealNFT.setApprovedContract(await simpleBuilder.getAddress(), true)
    await tx.wait()
}

const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deployBuilder(lockDealNFT)
