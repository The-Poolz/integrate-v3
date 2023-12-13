// utility.ts
import { ERC20Token, LockDealNFT, VaultManager } from "../typechain-types"
import { Wallet, constants } from "ethers"
import { ethers } from "hardhat"

const gasLimit = 35_000_000
const gasPrice = ethers.utils.parseUnits("5", "gwei")
const unixTime = Math.floor(Date.now() / 1000)
const week = 60 * 60 * 24 * 7
const startTime = unixTime + 1000
const finishTime = unixTime + week * 2
const amount = ethers.utils.parseUnits("100", 5)

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

async function createDealPool(user: Wallet, dealProvider: any, vaultManager: VaultManager, token: ERC20Token) {
    const userAddress: string = await user.address
    const tokenSignature = await createSignature(user, vaultManager, token)
    let tx = await dealProvider.connect(user).createNewPool([userAddress, token.address], [amount], tokenSignature, {
        gasLimit,
        gasPrice,
    })
    await tx.wait()
    const name = await dealProvider.name()
    console.log(name + ` NFT created`)
}

async function createLockPool(user: Wallet, lockProvider: any, vaultManager: VaultManager, token: ERC20Token) {
    const userAddress: string = await user.address
    const tokenSignature = await createSignature(user, vaultManager, token)
    let tx = await lockProvider
        .connect(user)
        .createNewPool([userAddress, token.address], [amount, startTime], tokenSignature, {
            gasLimit,
            gasPrice,
        })
    await tx.wait()
    const name = await lockProvider.name()
    console.log(name + ` NFT created`)
}

async function createTimedPool(user: Wallet, timedProvider: any, vaultManager: VaultManager, token: ERC20Token) {
    const userAddress: string = await user.address
    const tokenSignature = await createSignature(user, vaultManager, token)
    let tx = await timedProvider
        .connect(user)
        .createNewPool([userAddress, token.address], [amount, startTime, finishTime], tokenSignature, {
            gasLimit,
            gasPrice,
        })
    await tx.wait()
    const name = await timedProvider.name()
    console.log(name + ` NFT created`)
}

async function createRefundPool(
    user: Wallet,
    refundProvider: any,
    provider: any,
    vaultManager: VaultManager,
    token: ERC20Token,
    mainCoin: ERC20Token
) {
    let name = await refundProvider.name()
    const tokenSignature = await createSignature(user, vaultManager, token, token.address)
    const mainCoinsignature = await createSignature(user, vaultManager, token, mainCoin.address)
    const addresses = [user.address, token.address, mainCoin.address, provider.address]
    let params = [amount, startTime, finishTime, amount, finishTime]
    await refundProvider
        .connect(user)
        .createNewRefundPool(addresses, params, tokenSignature, mainCoinsignature, { gasLimit, gasPrice })
    console.log(name + ` NFT created`)
}

async function createSignature(
    user: Wallet,
    vaultManager: VaultManager,
    token: ERC20Token,
    tokenAddress: string = token.address
) {
    const dataToCheck = ethers.utils.solidityPack(["address", "uint256"], [tokenAddress, amount])
    const currentNonce = await vaultManager.nonces(user.address)
    const hash = ethers.utils.solidityKeccak256(
        ["bytes", "uint"],
        [dataToCheck, tokenAddress == token.address ? currentNonce : currentNonce.add(1)]
    )
    const signature = await user.signMessage(ethers.utils.arrayify(hash))
    return signature
}

export {
    deployFrom,
    setTrustee,
    approveContracts,
    createNewVault,
    approveToken,
    approveContract,
    createDealPool,
    createLockPool,
    createTimedPool,
    createRefundPool,
}
