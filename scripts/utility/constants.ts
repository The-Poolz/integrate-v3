import { ethers } from "hardhat"

export const gasLimit = 30_000_000
export const gasPrice = ethers.utils.parseUnits("5", "gwei")
export const unixTime = Math.floor(Date.now() / 1000)
export const week = 60 * 60 * 24 * 7
export const startTime = unixTime + 1000
export const finishTime = unixTime + week * 2
export const amount = parseInt(ethers.utils.parseUnits("100", 5).toString())
