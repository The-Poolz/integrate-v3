import { DispenserProvider, LockDealNFT } from "../../typechain-types"
import { deploy } from "../utility/deployment"
import { ethers } from "hardhat"

export async function deployDispenser(lockDealNFT: string) {
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const LockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFT) as any as LockDealNFT
    const DispenserProviderAddress = (await deploy("DispenserProvider", lockDealNFT)) as DispenserProvider
    const tx = await LockDealNFT.setApprovedContract(await DispenserProviderAddress.getAddress(), true)
    await tx.wait()
}

const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deployDispenser(lockDealNFT)
