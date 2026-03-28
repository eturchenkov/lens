import { useState } from "react"

export default function Lens({ endpoint }: { endpoint: string }) {
  const [genUI, setGenUI] = useState<string>("")
  const [textInput, setTextInput] = useState<string>("")

  return (
    <>
      <div className="w-full">
        <div dangerouslySetInnerHTML={{ __html: genUI }} />
      </div>
      <div className="w-full flex justify-center">
        <textarea
          className="w-1/3 resize-y rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key == "Enter" && e.ctrlKey) {
              e.preventDefault()
              const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  prompt: textInput,
                }),
              })
              const json = await res.json()
              setGenUI(json.text)
            }
          }}
          placeholder="Describe view you want"
          rows={2}
        />
      </div>
      <script src="https://cdn.tailwindcss.com"></script>
    </>
  )
}
