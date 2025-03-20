import { DispenserProvider, LockDealNFT } from "../../../typechain-types"
import { deploy } from "../deployment"
import { setApprovedContracts } from "../manageable"
import { ethers } from "hardhat"

export async function deployDispenser(lockDealNFT: string) {
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const LockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFT) as any as LockDealNFT
    const DispenserProvider = (await deploy("DispenserProvider", lockDealNFT)) as DispenserProvider
    await setApprovedContracts(LockDealNFT, [await DispenserProvider.getAddress()])
}

const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deployDispenser(lockDealNFT)
