const { input, select } = require("@inquirer/prompts")

async function promptUser(
    message: string,
    name: string,
    type = "input",
    choices: { name: string }[] = [],
    defaultValue = ""
) {
    let answer
    if (type === "input") {
        answer = await input({ message, default: defaultValue })
    } else if (type === "select") {
        answer = await select({
            message,
            choices: choices.map((choice) => ({ name: choice.name, value: choice.name })),
        })
    }
    return answer
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

async function getLockProviderAddress() {
    return await promptUser("Enter the Lock Provider address for deployment:", "providerAddress")
}

async function getCollateralProviderAddress() {
    return await promptUser("Enter the Collateral Provider address for deployment:", "collateralProviderAddress")
}

async function getMenu(menuItems: { name: string }[]) {
    return await promptUser("Choose a menu item:", "menuItem", "select", menuItems)
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
    getLockProviderAddress,
    getCollateralProviderAddress,
    getMenu,
    getOldDelay,
    getNewDelay,
    getRefundProviderAddress,
}
