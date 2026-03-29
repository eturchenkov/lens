import { useState, useRef } from "react"
import { Input } from "@/pages/api/lens"

export default function Lens({ endpoint }: { endpoint: string }) {
  const containerRef = useRef(null)
  const [genUI, setGenUI] = useState<string>("")
  const [textInput, setTextInput] = useState<string>("")

  return (
    <>
      <div className="w-full">
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: genUI }}
          onClick={async (e) => {
            e.target.setAttribute("current-event", "[ CLICK ]")
            const res = await request(endpoint, {
              type: "markup",
              content: containerRef.current.innerHTML,
            })
            setGenUI(res)
            e.stopPropagation()
          }}
        />
      </div>
      <div className="w-full flex justify-center">
        <textarea
          className="w-1/3 resize-y rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key == "Enter" && e.ctrlKey) {
              e.preventDefault()
              const res = await request(endpoint, {
                type: "prompt",
                content: textInput,
              })
              setGenUI(res)
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

const request = async (endpoint: string, input: Input) => {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input,
    }),
  })
  const json = await res.json()
  return json.text
}
