import {
    LockDealNFT,
    DealProvider,
    LockDealProvider,
    TimedDealProvider,
    VaultManager,
    SimpleBuilder,
    DispenserProvider,
} from "../typechain-types"
import { deploy } from "./utility/deployment"
import { setApprovedContracts } from "./utility/manageable"

async function deployAllContracts(baseURI: string = "") {
    const vaultManager: VaultManager = await deploy("VaultManager")

    // Deploy LockDealNFT contract
    const lockDealNFT: LockDealNFT = await deploy("LockDealNFT", await vaultManager.getAddress(), baseURI)
    // Set trustee
    let tx = await vaultManager.setTrustee(await lockDealNFT.getAddress())
    await tx.wait()

    // Deploy DealProvider contract
    const dealProvider: DealProvider = await deploy("DealProvider", await lockDealNFT.getAddress())

    // Deploy LockDealProvider contract
    const lockProvider: LockDealProvider = await deploy(
        "LockDealProvider",
        await lockDealNFT.getAddress(),
        await dealProvider.getAddress()
    )

    // Deploy TimedDealProvider contract
    const timedDealProvider: TimedDealProvider = await deploy(
        "TimedDealProvider",
        await lockDealNFT.getAddress(),
        await lockProvider.getAddress()
    )

    // Deploy Buiders
    const simpleBuilder: SimpleBuilder = await deploy("SimpleBuilder", await lockDealNFT.getAddress())

    // Deploy DispenserProvider
    const dispenserProvider: DispenserProvider = await deploy("DispenserProvider", await lockDealNFT.getAddress())

    // Set approved contracts
    await setApprovedContracts(lockDealNFT, [
        await dealProvider.getAddress(),
        await lockProvider.getAddress(),
        await timedDealProvider.getAddress(),
        await simpleBuilder.getAddress(),
        await dispenserProvider.getAddress(),
    ])
}

const baseURI = process.env.BASEURI || ""

deployAllContracts(baseURI).catch((error) => {
    console.error(error)
    process.exitCode = 1
})
