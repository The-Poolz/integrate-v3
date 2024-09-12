import { Wallet, constants } from "ethers"
import { ERC20Token, LockDealNFT, VaultManager } from "../../typechain-types"
import { gasLimit, gasPrice } from "./constants"

async function setTrustee(vaultManager: VaultManager, user: Wallet, address: string) {
    const tx = await vaultManager.connect(user).setTrustee(address, { gasLimit, gasPrice })
    await tx.wait()
}

async function approveContracts(user: Wallet, lockDealNFT: LockDealNFT, contracts: any[]) {
    for (const contract of contracts) {
        await approveContract(user, lockDealNFT, contract)
    }
}

async function createNewVault(vaultManager: VaultManager, user: Wallet, token: ERC20Token) {
    const tx = await vaultManager.connect(user)["createNewVault(address)"](token.address, { gasLimit, gasPrice })
    await tx.wait()
}

async function approveToken(token: ERC20Token, user: Wallet, spender: string) {
    const tx = await token.connect(user).approve(spender, constants.MaxUint256, { gasLimit, gasPrice })
    await tx.wait()
}

async function approveContract(user: Wallet, lockDealNFT: LockDealNFT, contract: any) {
    const tx = await lockDealNFT.connect(user).setApprovedContract(contract.address, true, {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
    })
    await tx.wait()
}

export { setTrustee, approveContracts, createNewVault, approveToken, approveContract }
