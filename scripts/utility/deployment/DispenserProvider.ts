import { DispenserProvider, LockDealNFT } from "../../../typechain-types"
import { deploy } from "../deployment"
import { ethers } from "hardhat"

export async function deployDispenser(lockDealNFT: string) {
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const LockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFT) as LockDealNFT
    const DispenserProviderAddress = (await deploy("DispenserProvider", lockDealNFT)) as DispenserProvider
    await LockDealNFT.setApprovedContract(DispenserProviderAddress.address, true)
}

const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deployDispenser(lockDealNFT)
