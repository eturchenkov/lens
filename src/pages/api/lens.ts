import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"

const extractHtmlContent = (respond: string): string => {
  const match = respond.match(/```html(.*?)```/s)
  return match ? match[1].replaceAll("\\n", "").replaceAll('\\"', '"') : ""
}

export const lens = async (prompt: string, data: string) => {
  console.log(prompt)
  const ctx = `Write simple html markup to show ${prompt}
[ Data ]
${data}
[ RULES ]
That markup will be embedded to existing html page.
Use beautiful dark tailwind styles.`
  console.log(ctx)
  const res = await llmRouter["groq"](ctx)
  console.log(res)
  return extractHtmlContent(res)
}

const anthropicClient = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
})

const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
})

const llmRouter = {
  anthropic: async (ctx: string) => {
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
  },
  groq: async (ctx: string) => {
    const response = await groqClient.responses.create({
      model: "openai/gpt-oss-20b",
      input: ctx,
      max_output_tokens: 8 * 1024,
    })
    return JSON.stringify(response.output_text)
  },
}
