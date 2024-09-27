import { utils, Wallet, ContractFactory } from "ethers"
import { ethers } from "hardhat"

export const deploy = async <T>(contractName: string, ...args: any[]): Promise<T> => {
    const Contract: ContractFactory = await ethers.getContractFactory(contractName)
    console.log(`Deploying ${contractName}...`)
    const unsignedTx = Contract.getDeployTransaction(...args)
    const gasLimit = await ethers.provider.estimateGas(unsignedTx)
    console.log(`Gas limit for ${contractName}: ${gasLimit}`)
    const gasPrice = await ethers.provider.getGasPrice()
    console.log(`Gas price: ${gasPrice.toString()}`)
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

export function delayVaultSettings(lockProvider: string) {
    const tier1 = utils.parseUnits("3499", 18)
    const tier2 = utils.parseUnits("19999", 18)
    const tier3 = utils.parseUnits("20000", 18)
    const ONE_DAY = 86400
    const tier1Timer = ONE_DAY * 10
    const tier2Timer = ONE_DAY * 20
    const tier3Timer = ONE_DAY * 30
    return [
        { provider: lockProvider, params: [tier1Timer], limit: tier1 },
        { provider: lockProvider, params: [tier2Timer], limit: tier2 },
        { provider: lockProvider, params: [tier3Timer], limit: tier3 },
    ]
}
