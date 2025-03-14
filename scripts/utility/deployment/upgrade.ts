import { DispenserProvider, LockDealNFT, LockDealProvider, TimedDealProvider } from "../../../typechain-types"
import { setApprovedContracts } from "../../utility/manageable"
import { deploy } from "../deployment"
import { ethers } from "hardhat"

async function upgrade(lockDealNFTAddress: string = "") {
    // attach lockDealNFT
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const lockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFTAddress) as any as LockDealNFT
    // deploy DealProvider, LockDealProvider and TimedDealProvider
    const dealProvider = await deploy("DealProvider", lockDealNFTAddress)
    await dealProvider.waitForDeployment()
    console.log(`DealProvider address: ${await dealProvider.getAddress()}`)

    const lockDealProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFTAddress, dealProvider)
    await lockDealProvider.waitForDeployment()
    console.log(`LockDealProvider address: ${await lockDealProvider.getAddress()}`)

    const timedDealProvider: TimedDealProvider = await deploy(
        "TimedDealProvider",
        lockDealNFTAddress,
        await lockDealProvider.getAddress()
    )
    await timedDealProvider.waitForDeployment()
    console.log(`TimedDealProvider address: ${await timedDealProvider.getAddress()}`)

    const dispenserProvider: DispenserProvider = await deploy("DispenserProvider", lockDealNFTAddress)
    await dispenserProvider.waitForDeployment()
    console.log(`DispenserProvider address: ${await dispenserProvider.getAddress()}`)

    // Set approved contracts
    await setApprovedContracts(lockDealNFT, [
        await dealProvider.getAddress(),
        await lockDealProvider.getAddress(),
        await timedDealProvider.getAddress(),
        await dispenserProvider.getAddress(),
    ])
}

// Retrieve environment variable
const lockDealNFTAddress = process.env.LOCK_DEAL_NFT_ADDRESS || ""

upgrade(lockDealNFTAddress)
