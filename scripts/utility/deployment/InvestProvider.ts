import { DispenserProvider, LockDealNFT } from "../../../typechain-types"
import { setApprovedContracts } from "../manageable"
import { deploy } from "../deployment"
import { ethers } from "hardhat"

export async function deployInvestProvider(DispenserProviderAddress: string) {
    const DispenserProviderFactory = await ethers.getContractFactory("DispenserProvider")
    const dispenserProvider: DispenserProvider = DispenserProviderFactory.attach(
        DispenserProviderAddress
    ) as any as DispenserProvider
    const lockDealNFTAddress = await dispenserProvider.lockDealNFT()
    const LockDealNFTFactory = await ethers.getContractFactory("LockDealNFT")
    const LockDealNFT: LockDealNFT = LockDealNFTFactory.attach(lockDealNFTAddress) as any as LockDealNFT
    // deploy InvestProvider
    const InvestProvider = await deploy("InvestProvider", lockDealNFTAddress, DispenserProviderAddress)
    await InvestProvider.waitForDeployment()
    // set InvestProvider as approved contract
    await setApprovedContracts(LockDealNFT, [await InvestProvider.getAddress()])
}

const DispenserProviderAddress = process.env.DISPENSER_PROVIDER_ADDRESS || ""

deployInvestProvider(DispenserProviderAddress)
