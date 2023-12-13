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

const password = process.env.PASSWORD ?? ""
const networkRPC = "https://bsc-testnet.publicnode.com"
const gasLimit = 35_000_000
const provider = new ethers.providers.JsonRpcProvider(networkRPC)
const gasPrice = ethers.utils.parseUnits("5", "gwei")
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
    let tx = await vaultManager
        .connect(user)
        .setTrustee(lockDealNFT.address, { gasLimit: gasLimit, gasPrice: gasPrice })
    await tx.wait()
    const contractsToApprove = [
        dealProvider,
        lockProvider,
        timedProvider,
        collateralProvider,
        refundProvider,
        simpleBuilder,
        simpleRefundBuilder,
    ]
    for (const contract of contractsToApprove) {
        await approveContract(user, lockDealNFT, contract)
    }
    tx = await token
        .connect(user)
        .approve(vaultManager.address, ethers.constants.MaxUint256, { gasLimit: gasLimit, gasPrice: gasPrice })
    await tx.wait()
    console.log("Setup done")
}

async function createPools(user: Wallet): Promise<number[]> {
    return []
}

async function splitPools(user: Wallet, ids: number[]) {}

async function withdrawPools(user: Wallet, ids: number[]) {}

async function deployFrom<T>(contractName: string, user: Wallet, ...args: string[]): Promise<T> {
    const Contract = await ethers.getContractFactory(contractName, user)
    const contract = await Contract.connect(user).deploy(...args)
    console.log(`Deploying ${contractName}...`)
    return contract.deployed() as Promise<T>
}

async function approveContract(user: Wallet, lockDealNFT: LockDealNFT, contract: any) {
    const tx = await lockDealNFT.connect(user).setApprovedContract(contract.address, true, {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
    })
    await tx.wait()
}

main()
