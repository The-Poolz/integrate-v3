import axios from "axios"
import dotenv from "dotenv"

const { select } = require("@inquirer/prompts")

dotenv.config()

// GitHub API details
const GITHUB_API_URL = "https://api.github.com/repos/The-Poolz/PoolzReactHelper/issues"

export async function openAndSubmitGitHubIssue(title: string, body: string) {
    try {
        // Submit the issue via the GitHub API
        const response = await axios.post(
            GITHUB_API_URL,
            {
                title: title,
                body: body,
            },
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        )
        console.log(`Issue created successfully: ${response.data.html_url}`)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(`Error creating GitHub issue: ${error.response?.data.message}`)
        } else if (error instanceof Error) {
            console.error(`Error creating GitHub issue: ${error.message}`)
        } else {
            console.error(`Unknown error occurred: ${JSON.stringify(error)}`)
        }
    }
}

export async function askYesNoQuestion(question: string): Promise<boolean> {
    return await select({
        message: question,
        choices: [
            { name: "Yes", value: true },
            { name: "No", value: false },
        ],
    })
}

interface RPCNetwork {
    chainId: number
    name: string
    rpc: { url: string }[] // An array of objects with a 'url' property for RPC URLs
    explorers: { url: string }[] // An array of objects with a 'url' property for explorers
    nativeCurrency: {
        name: string
        symbol: string
        decimals: number
    }
    faucets: string[] // An array of faucet URLs
}

export async function getDataByChainId(chainId: number): Promise<RPCNetwork | undefined> {
    try {
        const response = await axios.get<RPCNetwork[]>("https://chainlist.org/rpcs.json")
        return response.data.find((network) => network.chainId === chainId)
    } catch (error) {
        console.error("Error fetching RPCs:", error)
        return undefined
    }
}
