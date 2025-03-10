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
    const userAddress: string = await user.getAddress()
    const tokenSignature = await getSignature(user, vaultManager, token, await token.getAddress())
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
    tokenAddress: string,
    tokenAmount: bigint = amount
) {
    const currentNonce = await vaultManager.nonces(await user.getAddress())
    const packedData = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [await token.getAddress(), tokenAmount, (await token.getAddress()) ? currentNonce : currentNonce + 1n]
    )
    return await user.signMessage(ethers.getBytes(packedData))
}

export { createSimpleNFT, getSignature }
