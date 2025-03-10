import { DealProvider, LockDealProvider, TimedDealProvider, VaultManager, ERC20Token } from "../../typechain-types"
import { gasLimit, gasPrice, amount } from "./constants"
import { Wallet } from "ethers"
import { ethers } from "hardhat"

async function createSimpleNFT(
    user: Wallet,
    provider: DealProvider | LockDealProvider | TimedDealProvider,
    vaultManager: VaultManager,
    token: ERC20Token,
    poolParams: bigint[]
) {
    const userAddress: string = await user.address
    const tokenSignature = await getSignature(user, vaultManager, token, token.address)
    const tx = await provider
        .connect(user)
        .createNewPool([userAddress, await token.getAddress()], [...poolParams], tokenSignature, {
            gasLimit,
            gasPrice,
        })
    await tx.wait()
    const name = await provider.name()
    console.log(name + ` NFT created`)
}

async function getSignature(
    user: Wallet,
    vaultManager: VaultManager,
    token: ERC20Token,
    tokenAddress: string = token.address,
    tokenAmount: bigint = amount
) {
    const dataToCheck = ethers.utils.solidityPack(["address", "uint256"], [tokenAddress, tokenAmount])
    const currentNonce = await vaultManager.nonces(user.address)
    const hash = ethers.utils.solidityKeccak256(
        ["bytes", "uint"],
        [dataToCheck, tokenAddress == token.address ? currentNonce : currentNonce.add(1)]
    )
    return await user.signMessage(ethers.utils.arrayify(hash))
}

export { createSimpleNFT, getSignature }
