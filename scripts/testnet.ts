import "dotenv/config"
import {
    VaultManager,
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    CollateralProvider,
    RefundProvider,
    SimpleBuilder,
    SimpleRefundBuilder,
    ERC20Token,
} from "../typechain-types"
import { Wallet } from "ethers"
import { ethers } from "hardhat"
import { deployFrom, setTrustee, approveContracts, createNewVault, approveToken } from "./utility"

const password = process.env.PASSWORD ?? ""
const networkRPC = "https://bsc-testnet.publicnode.com"
const provider = new ethers.providers.JsonRpcProvider(networkRPC)
let vaultManager: VaultManager,
    lockDealNFT: LockDealNFT,
    dealProvider: DealProvider,
    lockProvider: LockDealProvider,
    timedProvider: TimedDealProvider,
    collateralProvider: CollateralProvider,
    refundProvider: RefundProvider,
    simpleBuilder: SimpleBuilder,
    simpleRefundBuilder: SimpleRefundBuilder,
    token: ERC20Token

async function main() {
    try {
        const user = new Wallet(password.toString(), provider)
        await deploy(user)
        await setup(user)
        const ids = await createPools(user)
        await splitPools(user, ids)
        await withdrawPools(user, ids)
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
    collateralProvider = await deployFrom("CollateralProvider", user, lockDealNFT.address, dealProvider.address)
    refundProvider = await deployFrom("RefundProvider", user, lockDealNFT.address, collateralProvider.address)
    simpleBuilder = await deployFrom("SimpleBuilder", user, lockDealNFT.address)
    simpleRefundBuilder = await deployFrom(
        "SimpleRefundBuilder",
        user,
        lockDealNFT.address,
        refundProvider.address,
        collateralProvider.address
    )
    token = await deployFrom("ERC20Token", user, "Test Token", "TT")
}

async function setup(user: Wallet) {
    await setTrustee(vaultManager, user, lockDealNFT.address)
    await approveContracts(user, lockDealNFT, [
        dealProvider,
        lockProvider,
        timedProvider,
        collateralProvider,
        refundProvider,
        simpleBuilder,
        simpleRefundBuilder,
    ])
    await createNewVault(vaultManager, user, token.address)
    await approveToken(token, user, vaultManager.address)
    console.log("Setup done")
}

async function createPools(user: Wallet): Promise<number[]> {
    return []
}

async function splitPools(user: Wallet, ids: number[]) {}

async function withdrawPools(user: Wallet, ids: number[]) {}

main()
