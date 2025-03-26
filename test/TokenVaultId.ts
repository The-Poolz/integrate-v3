import { deploy } from "../scripts/utility/deployment"
import {
    VaultManager,
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    ERC20Token,
} from "../typechain-types"
import { time } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Wallet } from "ethers"
import { ethers } from "hardhat"

describe("Token Vault Id", function () {
    let vaultManager: VaultManager
    let lockDealNFT: LockDealNFT
    let dealProvider: DealProvider
    let lockProvider: LockDealProvider
    let timedProvider: TimedDealProvider
    let token: ERC20Token
    let mainCoin: ERC20Token
    let tempToken: ERC20Token
    let tempToken2: ERC20Token
    const tokenVaultId = 2
    const mainCoinVaultId = 3
    let poolId: bigint
    let startTime: number
    let finishTime: number
    let params: [bigint, number, number, bigint, number]
    let receiver: SignerWithAddress
    let addresses: string[]
    const ONE_DAY = 86400
    const amount = ethers.parseUnits("1", 18)
    let user: Wallet

    before(async () => {
        ;[receiver] = await ethers.getSigners()
        user = receiver as unknown as Wallet
        vaultManager = (await deploy("VaultManager")) as VaultManager
        lockDealNFT = (await deploy("LockDealNFT", await vaultManager.getAddress(), "")) as LockDealNFT
        dealProvider = (await deploy("DealProvider", await lockDealNFT.getAddress())) as DealProvider
        lockProvider = (await deploy(
            "LockDealProvider",
            await lockDealNFT.getAddress(),
            await dealProvider.getAddress()
        )) as LockDealProvider
        timedProvider = (await deploy(
            "TimedDealProvider",
            await lockDealNFT.getAddress(),
            await lockProvider.getAddress()
        )) as TimedDealProvider
        token = (await deploy("ERC20Token", "Token", "TOKEN")) as ERC20Token
        mainCoin = (await deploy("ERC20Token", "MainCoin", "USDT")) as ERC20Token
        tempToken = (await deploy("ERC20Token", "Token1", "TOKEN1")) as ERC20Token
        tempToken2 = (await deploy("ERC20Token", "Token2", "TOKEN2")) as ERC20Token
        await lockDealNFT.setApprovedContract(await dealProvider.getAddress(), true)
        await lockDealNFT.setApprovedContract(await lockProvider.getAddress(), true)
        await lockDealNFT.setApprovedContract(await timedProvider.getAddress(), true)
        await token.approve(await vaultManager.getAddress(), amount * 100n)
        await mainCoin.approve(await vaultManager.getAddress(), amount * 100n)
        await lockDealNFT.approvePoolTransfers(true)
        console.log("\n")
    })

    beforeEach(async () => {
        poolId = await lockDealNFT.totalSupply()
        startTime = (await time.latest()) + ONE_DAY // plus 1 day
        finishTime = startTime + 7 * ONE_DAY // plus 7 days from `startTime`
        const mainCoinAmount = amount / 2n
        addresses = [
            await receiver.getAddress(),
            await token.getAddress(),
            await mainCoin.getAddress(),
            await timedProvider.getAddress(),
        ]
        params = [amount, startTime, finishTime, mainCoinAmount, finishTime]
    })

    it("should create 4 vaults", async () => {
        await vaultManager["createNewVault(address)"](await tempToken.getAddress())
        await vaultManager["createNewVault(address)"](await tempToken2.getAddress())
        await vaultManager["createNewVault(address)"](await token.getAddress())
        await vaultManager["createNewVault(address)"](await mainCoin.getAddress())
        expect(await vaultManager.vaultIdToTokenAddress(0)).to.equal(await tempToken.getAddress())
        expect(await vaultManager.vaultIdToTokenAddress(1)).to.equal(await tempToken2.getAddress())
        expect(await vaultManager.vaultIdToTokenAddress(tokenVaultId)).to.equal(await token.getAddress())
        expect(await vaultManager.vaultIdToTokenAddress(mainCoinVaultId)).to.equal(await mainCoin.getAddress())
    })
})
