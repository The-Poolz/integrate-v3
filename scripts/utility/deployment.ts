import { ContractDeployTransaction, Wallet, ContractFactory, BaseContract } from "ethers"
import { ethers } from "hardhat"

export const getGasData = async (unsignedTx: ContractDeployTransaction) => {
    const gasLimit = await ethers.provider.estimateGas(unsignedTx)
    const feeData = await ethers.provider.getFeeData()

    if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
        throw new Error("Failed to fetch gas price")
    }

    return {
        gasLimit,
        maxFeePerGas: (feeData.maxFeePerGas * 11n) / 10n, // Increase by 10%
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas, // Keep the suggested priority fee
    }
}

export const deploy = async <T extends BaseContract>(contractName: string, ...args: any[]): Promise<T> => {
    const Contract: ContractFactory = await ethers.getContractFactory(contractName)
    console.log(`Deploying ${contractName}...`)

    const unsignedTx = await Contract.getDeployTransaction(...args)

    // Fetch gas data
    const gasData = await getGasData(unsignedTx)

    const contract = await Contract.deploy(...args, gasData)
    console.log(`Deployed ${contractName} at ${await contract.getAddress()}`)
    return contract.waitForDeployment() as Promise<T>
}

export async function deployFrom<T extends BaseContract>(
    contractName: string,
    user: Wallet,
    ...args: any[]
): Promise<T> {
    const Contract = await ethers.getContractFactory(contractName, user)
    console.log(`Deploying ${contractName} from ${await user.getAddress()}...`)

    const unsignedTx = await Contract.getDeployTransaction(...args)

    // Fetch gas data
    const gasData = await getGasData(unsignedTx)

    const contract = await Contract.connect(user).deploy(...args, gasData)
    console.log(`Deployed ${contractName} at ${await contract.getAddress()}`)
    return contract.waitForDeployment() as any as Promise<T>
}