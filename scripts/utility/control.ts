import { Wallet } from "ethers"
import { ethers } from "hardhat"
import { LockDealNFT } from "../../typechain-types"
import { gasLimit, gasPrice } from "./constants"

export async function _splitPools(user: Wallet, lockDealNFT: LockDealNFT, ids: number[]) {
    const ratio = ethers.parseUnits("5", 20) // 50%
    const packedData = ethers.utils.defaultAbiCoder.encode(["uint256", "address"], [ratio, user.address])
    for (const id of ids) {
        const tx = await lockDealNFT
            .connect(user)
            ["safeTransferFrom(address,address,uint256,bytes)"](user.address, lockDealNFT.address, id, packedData, {
                gasLimit,
                gasPrice,
            })
        await tx.wait()
    }
}

export async function _withdrawPools(user: Wallet, lockDealNFT: LockDealNFT, ids: number[]) {
    for (const id of ids) {
        const tx = await lockDealNFT
            .connect(user)
            ["safeTransferFrom(address,address,uint256)"](user.address, lockDealNFT.address, id, {
                gasLimit,
                gasPrice,
            })
        await tx.wait()
    }
}
