import {
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    RefundProvider,
    VaultManager,
    ERC20Token,
} from "../../typechain-types"
import { Wallet } from "ethers"
import { ethers } from "hardhat"
import { gasLimit, gasPrice, startTime, finishTime, amount } from "./constants"

async function createSimpleNFT(
    user: Wallet,
    provider: DealProvider | LockDealProvider | TimedDealProvider,
    vaultManager: VaultManager,
    token: ERC20Token,
    poolParams: number[]
) {
    const userAddress: string = await user.address
    const tokenSignature = await getSignature(user, vaultManager, token, token.address)
    const tx = await provider
        .connect(user)
        .createNewPool([userAddress, token.address], [...poolParams], tokenSignature, {
            gasLimit,
            gasPrice,
        })
    await tx.wait()
    const name = await provider.name()
    console.log(name + ` NFT created`)
}

async function createRefundNFT(
    user: Wallet,
    refundProvider: RefundProvider,
    provider: any,
    vaultManager: VaultManager,
    token: ERC20Token,
    mainCoin: ERC20Token
) {
    const name = await refundProvider.name()
    const tokenSignature = await getSignature(user, vaultManager, token, token.address)
    const mainCoinsignature = await getSignature(user, vaultManager, token, mainCoin.address)
    const addresses = [user.address, token.address, mainCoin.address, provider.address]
    const params = [amount, startTime, finishTime, amount, finishTime]
    await refundProvider
        .connect(user)
        .createNewRefundPool(addresses, params, tokenSignature, mainCoinsignature, { gasLimit, gasPrice })
    console.log(name + ` NFT created`)
}

async function getSignature(
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
    return await user.signMessage(ethers.utils.arrayify(hash))
}

export { createSimpleNFT, createRefundNFT, getSignature }
