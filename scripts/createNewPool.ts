import {
    DealProvider,
    LockDealNFT,
    VaultManager,
    ERC20Token
} from "../typechain-types"
import { ethers } from "hardhat"
import { gasLimit, gasPrice } from "./utility/constants"

console.log("Creating new pool")

const tokenAddress = "0xb73603C5d87fA094B7314C74ACE2e64D165016fb"
const toAddress = "0xf7f1f00b13F4c3D818f052498902067aB91a3A66"
const amount = ethers.utils.parseUnits("5", 6)
const dealProviderAddress: string = "0x2Bb9cFF524C76eb2eA27bC6cDbB93447115D8dcC"

async function createNewPool() {
    const dealProvider = (await ethers.getContractAt("DealProvider", dealProviderAddress)) as DealProvider
    const lockDealNFTAddress = await dealProvider.lockDealNFT()
    console.log(lockDealNFTAddress);
    const lockDealNFT = (await ethers.getContractAt("LockDealNFT", lockDealNFTAddress)) as LockDealNFT
    const vaultManagerAddress = await lockDealNFT.vaultManager()
    console.log(vaultManagerAddress)
    const vaultManager = (await ethers.getContractAt("VaultManager", vaultManagerAddress)) as VaultManager
    const token = (await ethers.getContractAt("ERC20Token", tokenAddress)) as ERC20Token
    const fromAddress = await ethers.provider.getSigner().getAddress()
    console.log(fromAddress)
    const nounce = await vaultManager.nonces(fromAddress)
    console.log(nounce)
    const signature = await ethers.provider.getSigner().signMessage(
        ethers.utils.arrayify(
            ethers.utils.solidityKeccak256(["address", "uint256", "uint256"], [tokenAddress, amount, nounce])))
    console.log(signature);
    const tx = await token.approve(vaultManagerAddress, amount)
    await tx.wait()
    const addresses = [toAddress, tokenAddress]
    const params = [amount]
    await dealProvider.createNewPool(addresses, params, signature, {gasLimit: gasLimit, gasPrice: gasPrice})
}

createNewPool().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
