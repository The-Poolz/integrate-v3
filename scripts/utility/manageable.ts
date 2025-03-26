import { ERC20Token, LockDealNFT, VaultManager } from "../../typechain-types"
import { gasLimit, gasPrice } from "./constants"
import { Wallet } from "ethers"
import { ethers } from "hardhat"

async function setTrustee(vaultManager: VaultManager, user: Wallet, address: string) {
    const tx = await vaultManager.connect(user).setTrustee(address, { gasLimit, gasPrice })
    await tx.wait()
}

async function createNewVault(vaultManager: VaultManager, user: Wallet, token: ERC20Token) {
    const tx = await vaultManager
        .connect(user)
        ["createNewVault(address)"](await token.getAddress(), { gasLimit, gasPrice })
    await tx.wait()
}

async function approveToken(token: ERC20Token, user: Wallet, spender: string) {
    const tx = await token.connect(user).approve(spender, ethers.MaxUint256, { gasLimit, gasPrice })
    await tx.wait()
}

async function setApprovedContracts(lockDealNFT: LockDealNFT, contracts: string[], status: boolean = true) {
    for (const contract of contracts) {
        const tx = await lockDealNFT.setApprovedContract(contract, status)
        await tx.wait()
        console.log(`${contract} successfully approved by LockDealNFT`)
    }
}

export { setTrustee,  createNewVault, approveToken, setApprovedContracts }
