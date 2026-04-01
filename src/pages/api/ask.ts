import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import type { NextApiRequest, NextApiResponse } from "next"
import { Input, lensAgent } from "@/pages/api/lens"
import users from "@/pages/api/data"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ text: string }>,
) {
  if (req.method == "POST") {
    const { input }: { input: Input } = req.body
    const result = await lensAgent(transport, input, JSON.stringify(users))
    res.status(201).json({ text: result })
  }
}

const llmRouter = {
  anthropic: () => {
    const anthropicClient = new Anthropic({
      apiKey: process.env["ANTHROPIC_API_KEY"],
    })

    return async (ctx: string) => {
      const message = await anthropicClient.messages.create({
        max_tokens: 8 * 1024,
        messages: [
          {
            role: "user",
            content: ctx,
          },
        ],
        model: "claude-haiku-4-5",
      })

      return JSON.stringify(message.content[0].text)
    }
  },

  groq: () => {
    const groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    })

    return async (ctx: string) => {
      const response = await groqClient.responses.create({
        model: "openai/gpt-oss-120b",
        input: ctx,
        max_output_tokens: 8 * 1024,
      })
      return JSON.stringify(response.output_text)
    }
  },
}

const transport = llmRouter.anthropic()
