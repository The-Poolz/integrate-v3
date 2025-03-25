import { input, select } from "@inquirer/prompts"

type PromptType = "input" | "select"

async function promptUser(
    message: string,
    type: PromptType = "input",
    choices: { name: string }[] = [],
    defaultValue = ""
): Promise<string> {
    if (type === "input") {
        return await input({ message, default: defaultValue })
    } else {
        return await select({
            message,
            choices: choices.map(({ name }) => ({ name, value: name })),
        })
    }
}

async function getBaseURI(): Promise<string> {
    return await promptUser("Enter the baseURI for NFT deployment:")
}

async function getLockDealNFTAddress(): Promise<string> {
    return await promptUser("Enter the LockDealNFT address for deployment:")
}

async function getDealProviderAddress(): Promise<string> {
    return await promptUser("Enter the current Deal Provider address for deployment:")
}

async function getDispenserProviderAddress(): Promise<string> {
    return await promptUser("Enter the current Dispenser Provider address for deployment:")
}

async function getMenu(menuItems: { name: string }[]): Promise<string> {
    return await promptUser("Choose a menu item:", "select", menuItems)
}

export { getBaseURI, getLockDealNFTAddress, getDealProviderAddress, getDispenserProviderAddress, getMenu }