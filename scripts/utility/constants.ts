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
export const v1DelayVaultTestnet = "0x607155A953d5f598d2F7CcD9a6395Af389cfecE5"
export const v1DelayVault = "0x5eb57B1210338b13E3D5572d5e1670285Aa71702"
export const POOLX = "0xbAeA9aBA1454DF334943951d51116aE342eAB255"
export const POOLXTestnet = "0xE14A2A1006B83F363569BC7b5b733191E919ca34"
export const networkRPC = "https://bsc-testnet.publicnode.com"
export const provider = new ethers.providers.JsonRpcProvider(networkRPC)
// artifacts paths
export const lockDealNFTArtifact = "contracts/LockDealNFT/contracts/LockDealNFT/LockDealNFT.sol:LockDealNFT"
export const dealProviderArtifact = "contracts/LockDealNFT/contracts/SimpleProviders/DealProvider/DealProvider.sol:DealProvider"
export const lockProviderArtifact = "contracts/LockDealNFT/contracts/SimpleProviders/LockProvider/LockDealProvider.sol:LockDealProvider"
export const timedProviderArtifact = "contracts/LockDealNFT/contracts/SimpleProviders/TimedDealProvider/TimedDealProvider.sol:TimedDealProvider"
export const collateralProviderArtifact = "contracts/LockDealNFT.CollateralProvider/contracts/CollateralProvider.sol:CollateralProvider"
export const refundProviderArtifact = "contracts/LockDealNFT.RefundProvider/contracts/RefundProvider.sol:RefundProvider"