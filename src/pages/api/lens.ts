import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"],
})

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

  const message = await client.messages.create({
    max_tokens: 8 * 1024,
    messages: [
      {
        role: "user",
        content: ctx,
      },
    ],
    model: "claude-haiku-4-5",
  })

  const respond = JSON.stringify(message.content[0].text)
  console.log(respond)
  return extractHtmlContent(respond)
}
