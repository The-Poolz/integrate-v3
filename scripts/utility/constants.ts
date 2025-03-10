import "dotenv/config"
import { ethers } from "hardhat"

export const gasLimit = 30_000_000
export const gasPrice = ethers.parseUnits("5", "gwei")
export const unixTime = Math.floor(Date.now() / 1000)
export const week = 60 * 60 * 24 * 7
export const startTime = unixTime + 1000
export const finishTime = unixTime + week * 2
export const amount = ethers.parseUnits("100", 8)
export const password = process.env.PASSWORD ?? ""
export const POOLX = "0xbAeA9aBA1454DF334943951d51116aE342eAB255"
export const POOLXTestnet = "0xE14A2A1006B83F363569BC7b5b733191E919ca34"
export const networkRPC = "https://bsc-testnet.publicnode.com"
export const provider = new ethers.JsonRpcProvider(networkRPC)
