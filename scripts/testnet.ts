import { Wallet } from "ethers"
import {
    VaultManager,
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    SimpleBuilder,
    ERC20Token,
} from "../typechain-types"
import { deployFrom } from "./utility/deployment"
import { setTrustee, approveContracts, createNewVault, approveToken } from "./utility/manageable"
import { createSimpleNFT } from "./utility/creation"
import {
    amount,
    startTime,
    finishTime,
    password,
    provider
} from "./utility/constants"
import { _withdrawPools, _splitPools } from "./utility/control"
import { createMassSimplePools } from "./utility/builders"

let vaultManager: VaultManager,
    lockDealNFT: LockDealNFT,
    dealProvider: DealProvider,
    lockProvider: LockDealProvider,
    timedProvider: TimedDealProvider,
    simpleBuilder: SimpleBuilder,
    token: ERC20Token,
    mainCoin: ERC20Token

async function main() {
    try {
        const user = new Wallet(password.toString(), provider)
        await deploy(user)
        await setup(user)
        const ids = await createPools(user)
        await splitPools(user, ids)
        await withdrawPools(user, ids)
        await createMassSimplePools(user, simpleBuilder, vaultManager, dealProvider.address, token)
    } catch (error) {
        console.error("Error in main:", error)
    }
}

async function deploy(user: Wallet) {
    vaultManager = await deployFrom("VaultManager", user)
    lockDealNFT = await deployFrom("LockDealNFT", user, vaultManager.address, "")
    dealProvider = await deployFrom("DealProvider", user, lockDealNFT.address)
    lockProvider = await deployFrom("LockDealProvider", user, lockDealNFT.address, dealProvider.address)
    timedProvider = await deployFrom("TimedDealProvider", user, lockDealNFT.address, lockProvider.address)
    simpleBuilder = await deployFrom("SimpleBuilder", user, lockDealNFT.address)
    token = await deployFrom("ERC20Token", user, "Test Token", "TT")
    mainCoin = await deployFrom("ERC20Token", user, "USDT", "TT")
}

async function setup(user: Wallet) {
    await setTrustee(vaultManager, user, lockDealNFT.address)
    await approveContracts(user, lockDealNFT, [
        dealProvider,
        lockProvider,
        timedProvider,
        simpleBuilder
    ])
    await createNewVault(vaultManager, user, token)
    await createNewVault(vaultManager, user, mainCoin)
    await approveToken(token, user, vaultManager.address)
    await approveToken(mainCoin, user, vaultManager.address)
    console.log("Setup done")
}

async function createPools(user: Wallet): Promise<number[]> {
    const id = parseInt((await lockDealNFT.totalSupply()).toString())
    await createSimpleNFT(user, dealProvider, vaultManager, token, [amount])
    await createSimpleNFT(user, lockProvider, vaultManager, token, [amount, startTime])
    await createSimpleNFT(user, timedProvider, vaultManager, token, [amount, startTime, finishTime])
    // IDs are always [id, id + 1...] every time the script is run
    return [id, id + 1, id + 2, id + 3]
}

async function splitPools(user: Wallet, ids: number[]) {
    await _splitPools(user, lockDealNFT, ids)
    console.log("Split NFTs")
}

async function withdrawPools(user: Wallet, ids: number[]) {
    await _withdrawPools(user, lockDealNFT, ids)
    console.log("Withdraw NFTs")
}

main()
