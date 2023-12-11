import { ethers } from "hardhat"

export const deployed = async <T>(contractName: string, ...args: string[]): Promise<T> => {
    const Contract = await ethers.getContractFactory(contractName)
    const contract = await Contract.deploy(...args)
    console.log(`${contractName} contract deployed to ${contract.address}`)
    return contract.deployed() as Promise<T>
}