import { deploy, delayVaultSettings } from "../deployment"
import { DelayVaultMigrator } from "../../../typechain-types"
import { POOLX } from "../constants"

async function deployDelayProviderAndMigrator(lockDealNFT: string, v1DelayVault: string, lockProvider: string){
    const migrator: DelayVaultMigrator = await deploy("DelayVaultMigrator", lockDealNFT, v1DelayVault)
    await deploy("DelayVaultProvider", POOLX, migrator.address, delayVaultSettings(lockProvider))
}

// Retrieve environment variable
const lockDealNFT = process.env.LOCK_DEAL_NFT_ADDRESS || ""
const v1DelayVault = process.env.V1_DELAY_VAULT || ""
const lockProvider = process.env.LOCK_PROVIDER || ""

deployDelayProviderAndMigrator(lockDealNFT, v1DelayVault, lockProvider)