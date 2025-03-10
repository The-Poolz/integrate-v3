import { DispenserProvider, LockDealNFT, LockDealProvider, TimedDealProvider } from "../../../typechain-types"
import { setApprovedContracts } from "../../utility/manageable"
import { deploy } from "../deployment"
import { ethers } from "hardhat"

async function upgrade(dealProvider: string = "") {
    // Get LockDealNFT address from dealProvider
    if (!dealProvider) {
        throw new Error("dealProvider address is required")
    }
    const DealProviderFactory = await ethers.getContractFactory("DealProvider")
    const dealProviderInstance = DealProviderFactory.attach(dealProvider)
    const lockDealNFTAddress = await dealProviderInstance.lockDealNFT()
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const lockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFTAddress) as LockDealNFT
    // deploy LockDealProvider and TimedDealProvider
    const lockDealProvider: LockDealProvider = await deploy("LockDealProvider", lockDealNFTAddress, dealProvider)
    console.log(`LockDealProvider address: ${await lockDealProvider.getAddress()}`)

    const timedDealProvider: TimedDealProvider = await deploy(
        "TimedDealProvider",
        lockDealNFTAddress,
        await lockDealProvider.getAddress()
    )
    console.log(`TimedDealProvider address: ${await timedDealProvider.getAddress()}`)

    const dispenserProvider: DispenserProvider = await deploy("DispenserProvider", lockDealNFTAddress)
    console.log(`DispenserProvider address: ${await dispenserProvider.getAddress()}`)

    // Set approved contracts
    await setApprovedContracts(lockDealNFT, [
        await lockDealProvider.getAddress(),
        await timedDealProvider.getAddress(),
        await dispenserProvider.getAddress(),
    ])
}

// Retrieve environment variable
const dealProvider = process.env.DEAL_PROVIDER_ADDRESS || ""

upgrade(dealProvider)
