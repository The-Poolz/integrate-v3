import { getSignature } from "../scripts/utility/creation"
import { BuilderState } from "../typechain-types/contracts/LockDealNFT/contracts/Builders/SimpleRefundBuilder/SimpleRefundBuilder"
import {
    VaultManager,
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    RefundProvider,
    SimpleRefundBuilder,
    CollateralProvider,
    ERC20Token,
} from "../typechain-types"
import {
    lockDealNFTArtifact,
    dealProviderArtifact,
    lockProviderArtifact,
    timedProviderArtifact,
    collateralProviderArtifact,
    refundProviderArtifact,
} from "../scripts/utility/constants"
import { time } from "@nomicfoundation/hardhat-network-helpers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { deploy } from "../scripts/utility/deployment"
import { BigNumber, Wallet } from "ethers"
import { ethers } from "hardhat"
import { expect } from "chai"

describe("Token Vault Id", function () {
    let vaultManager: VaultManager
    let lockDealNFT: LockDealNFT
    let dealProvider: DealProvider
    let lockProvider: LockDealProvider
    let timedProvider: TimedDealProvider
    let collateralProvider: CollateralProvider
    let refundProvider: RefundProvider
    let simpleRefundBuilder: SimpleRefundBuilder
    let token: ERC20Token
    let mainCoin: ERC20Token
    let tempToken: ERC20Token
    let tempToken2: ERC20Token
    const tokenVaultId = 2
    const mainCoinVaultId = 3
    let poolId: BigNumber
    let startTime: number
    let finishTime: number
    let params: [BigNumber, number, number, BigNumber, number]
    let receiver: SignerWithAddress
    let addresses: string[]
    const ONE_DAY = 86400
    const amount = ethers.utils.parseUnits("1", 18)
    let user: Wallet

    before(async () => {
        [receiver] = await ethers.getSigners()
        user = receiver as unknown as Wallet
        vaultManager = (await deploy("VaultManager")) as VaultManager
        lockDealNFT = (await deploy(lockDealNFTArtifact, vaultManager.address, "")) as LockDealNFT
        dealProvider = (await deploy(dealProviderArtifact, lockDealNFT.address)) as DealProvider
        lockProvider = (await deploy(
            lockProviderArtifact,
            lockDealNFT.address,
            dealProvider.address
        )) as LockDealProvider
        timedProvider = (await deploy(
            timedProviderArtifact,
            lockDealNFT.address,
            lockProvider.address
        )) as TimedDealProvider
        collateralProvider = (await deploy(
            collateralProviderArtifact,
            lockDealNFT.address,
            dealProvider.address
        )) as CollateralProvider
        refundProvider = (await deploy(
            refundProviderArtifact,
            lockDealNFT.address,
            collateralProvider.address
        )) as RefundProvider
        token = (await deploy("ERC20Token", "Token", "TOKEN")) as ERC20Token
        mainCoin = (await deploy("ERC20Token", "MainCoin", "USDT")) as ERC20Token
        tempToken = (await deploy("ERC20Token", "Token1", "TOKEN1")) as ERC20Token
        tempToken2 = (await deploy("ERC20Token", "Token2", "TOKEN2")) as ERC20Token
        simpleRefundBuilder = (await deploy(
            "SimpleRefundBuilder",
            lockDealNFT.address,
            refundProvider.address,
            collateralProvider.address
        )) as SimpleRefundBuilder
        await vaultManager.setTrustee(lockDealNFT.address)

        await lockDealNFT.setApprovedContract(dealProvider.address, true)
        await lockDealNFT.setApprovedContract(lockProvider.address, true)
        await lockDealNFT.setApprovedContract(timedProvider.address, true)
        await lockDealNFT.setApprovedContract(collateralProvider.address, true)
        await lockDealNFT.setApprovedContract(refundProvider.address, true)
        await lockDealNFT.setApprovedContract(simpleRefundBuilder.address, true)
        await token.approve(vaultManager.address, amount.mul(100))
        await mainCoin.approve(vaultManager.address, amount.mul(100))
        await lockDealNFT.approvePoolTransfers(true)
        console.log("\n")
    })

    beforeEach(async () => {
        poolId = await lockDealNFT.totalSupply()
        startTime = (await time.latest()) + ONE_DAY // plus 1 day
        finishTime = startTime + 7 * ONE_DAY // plus 7 days from `startTime`
        const mainCoinAmount = amount.div(2)
        addresses = [receiver.address, token.address, mainCoin.address, timedProvider.address]
        params = [amount, startTime, finishTime, mainCoinAmount, finishTime]
    })

    it("should create 4 vaults", async () => {
        await vaultManager["createNewVault(address)"](tempToken.address)
        await vaultManager["createNewVault(address)"](tempToken2.address)
        await vaultManager["createNewVault(address)"](token.address)
        await vaultManager["createNewVault(address)"](mainCoin.address)
        expect(await vaultManager.vaultIdToTokenAddress(0)).to.equal(tempToken.address)
        expect(await vaultManager.vaultIdToTokenAddress(1)).to.equal(tempToken2.address)
        expect(await vaultManager.vaultIdToTokenAddress(tokenVaultId)).to.equal(token.address)
        expect(await vaultManager.vaultIdToTokenAddress(mainCoinVaultId)).to.equal(mainCoin.address)
    })

    it("checking vaultIds by creating RefundProvider NFT", async () => {
        const tokenSignature = await getSignature(user, vaultManager, token, token.address, amount)
        const mainCoinsignature = await getSignature(user, vaultManager, token, mainCoin.address, amount.div(2))
        await refundProvider.connect(user).createNewRefundPool(addresses, params, tokenSignature, mainCoinsignature)
        expect(await lockDealNFT.poolIdToVaultId(poolId)).to.equal(tokenVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(1))).to.equal(tokenVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(2))).to.equal(mainCoinVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(3))).to.equal(mainCoinVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(4))).to.equal(tokenVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(5))).to.equal(mainCoinVaultId)
    })

    it("checking vaultIds by creating simple refund builder NFTs", async () => {
        const addresses = [timedProvider.address, token.address, mainCoin.address]
        const userData = _createUsers(amount.toString(), `2`)
        const params: string[][] = [
            [amount.toString(), finishTime.toString()],
            [startTime.toString(), finishTime.toString()],
        ]
        const tokenSignature = await getSignature(user, vaultManager, token, token.address, amount.mul(2))
        const mainCoinsignature = await getSignature(user, vaultManager, token, mainCoin.address, amount)
        await simpleRefundBuilder
            .connect(user)
            .buildMassPools(addresses, userData, params, tokenSignature, mainCoinsignature)
        expect(await lockDealNFT.poolIdToVaultId(poolId)).to.equal(tokenVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(1))).to.equal(tokenVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(2))).to.equal(mainCoinVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(3))).to.equal(mainCoinVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(4))).to.equal(tokenVaultId)
        expect(await lockDealNFT.poolIdToVaultId(poolId.add(5))).to.equal(mainCoinVaultId)
    })

    function _createUsers(amount: string, userCount: string): BuilderState.BuilderStruct {
        const pools = []
        const length = parseInt(userCount)
        // Create signers
        for (let i = 0; i < length; ++i) {
            pools.push({ user: user.address, amount: amount })
        }
        const totalAmount = ethers.BigNumber.from(amount).mul(length)
        return { userPools: pools, totalAmount: totalAmount }
    }
})
