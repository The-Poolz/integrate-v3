import { deploy } from "../deployment"

export async function deployDispenser(lockDealNFT: string) {
    await deploy("DispenserProvider", lockDealNFT)
}

const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deployDispenser(lockDealNFT)
