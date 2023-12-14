import "dotenv/config"
import { BigNumber } from "ethers"
import { ethers } from "hardhat"

export const gasLimit = 30_000_000
export const gasPrice = ethers.utils.parseUnits("5", "gwei")
export const unixTime = BigNumber.from(Math.floor(Date.now() / 1000))
export const week = 60 * 60 * 24 * 7
export const startTime = unixTime.add(1000)
export const finishTime = unixTime.add(week).mul(2)
export const amount = ethers.utils.parseUnits("100", 8)
export const password = process.env.PASSWORD ?? ""
export const networkRPC = "https://bsc-testnet.publicnode.com"
export const provider = new ethers.providers.JsonRpcProvider(networkRPC)
