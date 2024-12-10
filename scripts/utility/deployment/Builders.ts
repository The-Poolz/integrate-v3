import { deploy } from "../deployment"

export async function deployBuilder(lockDealNFT: string) {
    await deploy("SimpleBuilder", lockDealNFT)
}

const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""

deployBuilder(lockDealNFT)
