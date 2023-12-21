import { deploy } from "../deployment"

export async function deployLightMigrator(lockDealNFT: string, oldDelay: string, newDelay: string) {
    await deploy("LightMigrator", lockDealNFT, oldDelay, newDelay)
}

// Retrieve environment variables
const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""
const oldDelay = process.env.OLD_DELAY || ""
const newDelay = process.env.NEW_DELAY || ""

deployLightMigrator(lockDealNFT, oldDelay, newDelay)