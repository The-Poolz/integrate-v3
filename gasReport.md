## Methods
| **Symbol** | **Meaning**                                                                              |
| :--------: | :--------------------------------------------------------------------------------------- |
|    **◯**   | Execution gas for this method does not include intrinsic gas overhead                    |
|    **△**   | Cost was non-zero but below the precision setting for the currency display (see options) |

|                                                                                          |       Min |       Max |       Avg | Calls | usd avg |
| :--------------------------------------------------------------------------------------- | --------: | --------: | --------: | ----: | ------: |
| **..\@poolzfinance\lockdeal-nft\contracts\LockDealNFT\LockDealNFT.sol:LockDealNFT**      |           |           |           |       |         |
|        *approvePoolTransfers(bool)*                                                      |         - |         - |    44,045 |     1 |       - |
|        *setApprovedContract(address,bool)*                                               |    50,856 |    50,868 |    50,866 |     6 |       - |
| **ERC20Token**                                                                           |           |           |           |       |         |
|        *approve(address,uint256)*                                                        |         - |         - |    46,528 |     2 |       - |
| **LockDealNFT.RefundProvider\contracts\RefundProvider.sol:RefundProvider**               |           |           |           |       |         |
|        *createNewRefundPool(address[],uint256[],bytes,bytes)*                            |         - |         - | 1,449,186 |     1 |       - |
| **SimpleRefundBuilder**                                                                  |           |           |           |       |         |
|        *buildMassPools(address[],((address,uint256)[],uint256),uint256[][],bytes,bytes)* |         - |         - | 1,949,710 |     1 |       - |
| **VaultManager**                                                                         |           |           |           |       |         |
|        *createNewVault(address)*                                                         | 1,283,188 | 1,285,988 | 1,285,288 |     4 |       - |
|        *setTrustee(address)*                                                             |         - |         - |    51,655 |     1 |       - |

## Deployments
|                                                                                                     |     Min |    Max  |       Avg | Block % | usd avg |
| :-------------------------------------------------------------------------------------------------- | ------: | ------: | --------: | ------: | ------: |
| **..\@poolzfinance\collateral-provider\contracts\CollateralProvider.sol:CollateralProvider**        |       - |       - | 3,849,233 |     3 % |       - |
| **..\@poolzfinance\lockdeal-nft\contracts\LockDealNFT\LockDealNFT.sol:LockDealNFT**                 |       - |       - | 6,003,602 |   4.6 % |       - |
| **ERC20Token**                                                                                      | 853,339 | 853,363 |   853,357 |   0.7 % |       - |
| **LockDealNFT.RefundProvider\contracts\RefundProvider.sol:RefundProvider**                          |       - |       - | 4,206,393 |   3.2 % |       - |
| **LockDealNFT\contracts\SimpleProviders\DealProvider\DealProvider.sol:DealProvider**                |       - |       - | 2,093,723 |   1.6 % |       - |
| **LockDealNFT\contracts\SimpleProviders\LockProvider\LockDealProvider.sol:LockDealProvider**        |       - |       - | 2,262,092 |   1.7 % |       - |
| **LockDealNFT\contracts\SimpleProviders\TimedDealProvider\TimedDealProvider.sol:TimedDealProvider** |       - |       - | 2,511,786 |   1.9 % |       - |
| **SimpleRefundBuilder**                                                                             |       - |       - | 4,183,217 |   3.2 % |       - |
| **VaultManager**                                                                                    |       - |       - | 5,611,090 |   4.3 % |       - |

## Solidity and Network Config
| **Settings**        | **Value**   |
| ------------------- | ----------- |
| Solidity: version   | 0.8.24      |
| Solidity: optimized | true        |
| Solidity: runs      | 200         |
| Solidity: viaIR     | false       |
| Block Limit         | 130,000,000 |
| Gas Price           | -           |
| Token Price         | -           |
| Network             | BINANCE     |
| Toolchain           | hardhat     |

