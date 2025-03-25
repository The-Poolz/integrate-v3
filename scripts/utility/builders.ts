import { SimpleBuilder, ERC20Token, VaultManager } from "../../typechain-types"
import { gasLimit, gasPrice, amount } from "./constants"
import { getSignature } from "./creation"
import { Wallet } from "ethers"

const sendData = {
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
    totalAmount: amount * 9n,
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
            [provider, await token.getAddress()],
            sendData,
            [],
            await getSignature(user, vaultManager, token, await token.getAddress(), amount * 9n),
            {
                gasLimit,
                gasPrice,
            }
        )
    await tx.wait()
    console.log("Mass simple NFTs created")
}