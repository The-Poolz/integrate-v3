import { ERC20Token, LockDealNFT, VaultManager } from "../typechain-types"
import { Wallet, constants } from "ethers"
import { ethers } from "hardhat"

const gasLimit = 35_000_000
const gasPrice = ethers.utils.parseUnits("5", "gwei")

async function deployFrom<T>(contractName: string, user: Wallet, ...args: string[]): Promise<T> {
    const Contract = await ethers.getContractFactory(contractName, user)
    const contract = await Contract.connect(user).deploy(...args)
    console.log(`Deploying ${contractName}...`)
    return contract.deployed() as Promise<T>
}

async function setTrustee(vaultManager: VaultManager, user: Wallet, address: string) {
    const tx = await vaultManager.connect(user).setTrustee(address, { gasLimit, gasPrice })
    await tx.wait()
}

async function approveContracts(user: Wallet, lockDealNFT: LockDealNFT, contracts: any[]) {
    for (const contract of contracts) {
        await approveContract(user, lockDealNFT, contract)
    }
}

async function createNewVault(vaultManager: VaultManager, user: Wallet, token: string) {
    const tx = await vaultManager.connect(user)["createNewVault(address)"](token, { gasLimit, gasPrice })
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

export { deployFrom, setTrustee, approveContracts, createNewVault, approveToken, approveContract }
