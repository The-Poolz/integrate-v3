// inquirerPrompts.js
const inquirer = require("inquirer")

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

async function getCollateralProviderAddress() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "collateralProviderAddress",
            message: "Enter the Collateral Provider address for deployment:",
        },
    ])
    return answer.collateralProviderAddress
}

async function getMenu(menuItems: { name: string }[]) {
    const answer = await inquirer.prompt([
        {
            type: "list",
            name: "menuItem",
            message: "Choose a menu item:",
            choices: menuItems,
        },
    ])
    return answer.menuItem
}

async function getOldDelay() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "oldDelay",
            message: "Enter the old delay address for deployment:",
        },
    ])
    return answer.oldDelay
}

async function getNewDelay() {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "newDelay",
            message: "Enter the new delay address for deployment:",
        },
    ])
    return answer.newDelay
}

export {
    getBaseURI,
    getLockDealNFTAddress,
    getDealProviderAddress,
    getCollateralProviderAddress,
    getMenu,
    getOldDelay,
    getNewDelay,
}
