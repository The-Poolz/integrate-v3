// inquirerPrompts.js
const inquirer = require("inquirer")

async function promptUser(
    message: string,
    name: string,
    type = "input",
    choices: { name: string }[] = [],
    defaultValue = ""
) {
    const answer = await inquirer.prompt([
        {
            type,
            name,
            message,
            choices,
            default: defaultValue,
        },
    ])
    return answer[name]
}

async function getBaseURI() {
    return await promptUser("Enter the baseURI for NFT deployment:", "baseURI")
}

async function getLockDealNFTAddress() {
    return await promptUser("Enter the LockDealNFT address for deployment:", "lockDealNFTAddress")
}

async function getDealProviderAddress() {
    return await promptUser("Enter the Deal Provider address for deployment:", "providerAddress")
}

async function getCollateralProviderAddress() {
    return await promptUser("Enter the Collateral Provider address for deployment:", "collateralProviderAddress")
}

async function getMenu(menuItems: { name: string }[]) {
    return await promptUser("Choose a menu item:", "menuItem", "list", menuItems)
}

async function getOldDelay() {
    return await promptUser("Enter the old delay address for deployment:", "oldDelay")
}

async function getNewDelay() {
    return await promptUser("Enter the new delay address for deployment:", "newDelay")
}

async function getRefundProviderAddress() {
    return await promptUser("Enter the Refund Provider address for deployment:", "refundProviderAddress")
}

export {
    getBaseURI,
    getLockDealNFTAddress,
    getDealProviderAddress,
    getCollateralProviderAddress,
    getMenu,
    getOldDelay,
    getNewDelay,
    getRefundProviderAddress,
}
