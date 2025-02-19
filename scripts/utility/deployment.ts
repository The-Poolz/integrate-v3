import { TransactionRequest } from "@ethersproject/abstract-provider"
import { utils, Wallet, ContractFactory } from "ethers"
import { ethers } from "hardhat"

export const getGasData = async (unsignedTx: TransactionRequest) => {
    let gasLimit = await ethers.provider.estimateGas(unsignedTx)
    let gasPrice = await ethers.provider.getGasPrice()
    // add 10% to the gas price
    gasPrice = gasPrice.add(gasPrice.div(10))
    return { gasLimit, gasPrice }
}

export const deploy = async <T>(contractName: string, ...args: any[]): Promise<T> => {
    const Contract: ContractFactory = await ethers.getContractFactory(contractName)
    console.log(`Deploying ${contractName}...`)
    const unsignedTx = Contract.getDeployTransaction(...args)
    // Fetch gas data
    const { gasLimit, gasPrice } = await getGasData(unsignedTx)
    const contract = await Contract.deploy(...args, {
        gasLimit: gasLimit,
        maxFeePerGas: gasPrice,
    })
    console.log(`${contractName} deployed at: ${contract.address}`)
    return contract.deployed() as Promise<T>
}

export async function deployFrom<T>(contractName: string, user: Wallet, ...args: any[]): Promise<T> {
    const Contract = await ethers.getContractFactory(contractName, user)
    console.log(`Deploying ${contractName}...`)
    const unsignedTx = Contract.getDeployTransaction(...args)
    // Fetch gas data
    const { gasLimit, gasPrice } = await getGasData(unsignedTx)
    // Deploy with the user's wallet and gas settings
    const contract = await Contract.connect(user).deploy(...args, {
        gasLimit: gasLimit,
        maxFeePerGas: gasPrice,
    })
    return contract.deployed() as Promise<T>
}