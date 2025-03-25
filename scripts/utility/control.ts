import { LockDealNFT } from "../../typechain-types"
import { gasLimit, gasPrice } from "./constants"
import { Wallet } from "ethers"
import { ethers } from "hardhat"

export async function _splitPools(user: Wallet, lockDealNFT: LockDealNFT, ids: number[]) {
    const ratio = ethers.parseUnits("5", 20) // 50%
    const packedData = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address"],
        [ratio, await user.getAddress()]
    )
    for (const id of ids) {
        const tx = await lockDealNFT
            .connect(user)
            ["safeTransferFrom(address,address,uint256,bytes)"](
                await user.getAddress(),
                await lockDealNFT.getAddress(),
                id,
                packedData,
                {
                    gasLimit,
                    gasPrice,
                }
            )
        await tx.wait()
    }
}

export async function _withdrawPools(user: Wallet, lockDealNFT: LockDealNFT, ids: number[]) {
    for (const id of ids) {
        const tx = await lockDealNFT
            .connect(user)
            ["safeTransferFrom(address,address,uint256)"](await user.getAddress(), await lockDealNFT.getAddress(), id, {
                gasLimit,
                gasPrice,
            })
        await tx.wait()
    }
}