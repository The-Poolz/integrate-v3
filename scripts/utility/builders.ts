import { Wallet } from "ethers"
import { gasLimit, gasPrice, amount } from "./constants"
import { SimpleBuilder, SimpleRefundBuilder, ERC20Token, VaultManager } from "../../typechain-types"
import { getSignature } from "./creation"
import { BuilderState } from "../../typechain-types"
import { finishTime } from "./constants"

const sendData: BuilderState.BuilderStruct = {
    userPools: [
        { user: "0xf7f1f00b13F4c3D818f052498902067aB91a3A66", amount: amount },
        { user: "0xf7f1f00b13F4c3D818f052498902067aB91a3A66", amount: amount },
        { user: "0xf7f1f00b13F4c3D818f052498902067aB91a3A66", amount: amount },
        { user: "0x6063fBa0fBd645d648C129854Cce45A70dd89691", amount: amount },
        { user: "0x6063fBa0fBd645d648C129854Cce45A70dd89691", amount: amount },
        { user: "0x6063fBa0fBd645d648C129854Cce45A70dd89691", amount: amount },
        { user: "0xf7f1f00b13F4c3D818f052498902067aB91a3A66", amount: amount },
        { user: "0xf7f1f00b13F4c3D818f052498902067aB91a3A66", amount: amount },
        { user: "0xf7f1f00b13F4c3D818f052498902067aB91a3A66", amount: amount },
    ],
    totalAmount: amount.mul(9),
}

export async function createMassSimplePools(
    user: Wallet,
    simpleBuilder: SimpleBuilder,
    vaultManager: VaultManager,
    provider: string,
    token: ERC20Token
) {
    const tx = await simpleBuilder
        .connect(user)
        .buildMassPools(
            [provider, token.address],
            sendData,
            [],
            getSignature(user, vaultManager, token, token.address, amount.mul(9)),
            {
                gasLimit,
                gasPrice,
            }
        )
    await tx.wait()
    console.log("Mass simple NFTs created")
}

export async function createMassRefundPools(
    user: Wallet,
    simpleRefundBuilder: SimpleRefundBuilder,
    vaultManager: VaultManager,
    provider: string,
    token: ERC20Token,
    mainCoin: ERC20Token
) {
    const tx = await simpleRefundBuilder
        .connect(user)
        .buildMassPools(
            [provider, token.address, mainCoin.address],
            sendData,
            [[amount.mul(3), finishTime], []],
            getSignature(user, vaultManager, token, token.address, amount.mul(9)),
            getSignature(user, vaultManager, token, mainCoin.address, amount.mul(3)),
            {
                gasLimit,
                gasPrice,
            }
        )
    await tx.wait()
    console.log("Mass refund NFTs created")
}
