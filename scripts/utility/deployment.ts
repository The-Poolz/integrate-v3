import { ethers } from "hardhat"
import { gasLimit, gasPrice } from "./constants"
import { utils, Wallet } from "ethers"

export const deploy = async <T>(contractName: string, ...args: any[]): Promise<T> => {
    const Contract = await ethers.getContractFactory(contractName)
    const contract = await Contract.deploy(...args, { gasLimit, gasPrice })
    console.log(`${contractName} deployed at: ${contract.address}`)
    return contract.deployed() as Promise<T>
}

export async function deployFrom<T>(contractName: string, user: Wallet, ...args: any[]): Promise<T> {
    const Contract = await ethers.getContractFactory(contractName, user)
    const contract = await Contract.connect(user).deploy(...args)
    console.log(`Deploying ${contractName}...`)
    return contract.deployed() as Promise<T>
}

// Example abi.hashex for encoded data: [
//     ["0xb6bb31a46744f3946fcf799f74109d8b894778ca", [], "250000000000000000000"],
//     ["0xa81cfa97856db04bc225a2dcc902dcd3fd7f9d84", [604800], "3500000000000000000000"],
//     ["0x999a76a387ad9d199544cfbafad1673a2c39aa11", [604800, 2419200], "20000000000000000000000"],
// ]

export function delayVaultSettings(dealProvider: string, lockProvider: string, timedDealProvider: string) {
    const tier1 = utils.parseUnits("250", 18)
    const tier2 = utils.parseUnits("3500", 18)
    const tier3 = utils.parseUnits("20000", 18)
    const ONE_DAY = 86400
    const week = ONE_DAY * 7
    const startTime = week
    const finishTime = week * 4
    return [
        { provider: dealProvider, params: [], limit: tier1 },
        { provider: lockProvider, params: [startTime], limit: tier2 },
        { provider: timedDealProvider, params: [startTime, finishTime], limit: tier3 },
    ]
}
