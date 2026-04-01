import { createPromptCtx, createViewCtx } from "@/pages/api/ctx"
export type Input = { type: "prompt" | "markup"; content: string }

const extractHtmlContent = (respond: string): string => {
  const match = respond.match(/```html(.*?)```/s)
  return match ? match[1].replaceAll("\\n", "").replaceAll('\\"', '"') : ""
}

export const lensAgent = async (
  transport: (data: string) => Promise<string>,
  input: Input,
  data: string,
) => {
  console.log(input)
  const ctx =
    input.type === "prompt"
      ? createPromptCtx(input.content, data)
      : createViewCtx(input.content, data)

  console.log(ctx)
  const res = await transport(ctx)
  console.log(res)
  const htmlContent = extractHtmlContent(res)
  console.log(htmlContent)
  return htmlContent
}
