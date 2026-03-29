import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"

export type Input = { type: "prompt" | "markup"; content: string }

const extractHtmlContent = (respond: string): string => {
  const match = respond.match(/```html(.*?)```/s)
  return match ? match[1].replaceAll("\\n", "").replaceAll('\\"', '"') : ""
}

export const lens = async (input: Input, data: string) => {
  console.log(input)
  let res = ""
  if (input.type === "prompt") {
    const ctx = `Write simple html markup to show ${input.content}
[ Data ]
${data}
[ RULES ]
That markup will be embedded to existing html page.
Use beautiful dark tailwind styles.`
    console.log(ctx)
    res = await llmRouter["groq"](ctx)
  } else {
    const ctx = `Use following markup and write next view user should get in browser.
Right now user made click event that in the markup notes as attribute current-event="[ CLICK ]" on target DOM element.
All elements should be visiable.
Don't add any <script> tags there.
${input.content}
[ Data ]
${data}
[ RULES ]
That markup will be embedded to existing html page.
Use beautiful dark tailwind styles.`
    console.log(ctx)
    res = await llmRouter["groq"](ctx)
  }

  console.log(res)
  const htmlContent = extractHtmlContent(res)
  console.log(htmlContent)
  return htmlContent
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
