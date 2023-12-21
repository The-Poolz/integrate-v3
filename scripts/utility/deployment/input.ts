async function getBaseURI() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "baseURI",
            message: "Enter the baseURI for NFT deployment:",
            default: "",
        },
    ])
    return answer.baseURI
}

async function getLockDealNFTAddress() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "lockDealNFTAddress",
            message: "Enter the LockDealNFT address for deployment:",
        },
    ])
    return answer.lockDealNFTAddress
}

async function getDealProviderAddress() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "providerAddress",
            message: "Enter the Deal Provider address for deployment:",
        },
    ])
    return answer.providerAddress
}

export { getBaseURI, getLockDealNFTAddress, getDealProviderAddress }
