
import axios from "axios"
import dotenv from "dotenv"

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