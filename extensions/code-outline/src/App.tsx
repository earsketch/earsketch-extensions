import { useState } from "react"
import { parser } from "@lezer/python"
import "./App.css"

function requestEarSketch<T>(fn: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) {
        return
      }

      window.removeEventListener("message", handleMessage)

      try {
        const result =
          typeof event.data === "string"
            ? JSON.parse(event.data)
            : event.data

        if (result?.error) {
          reject(new Error(result.error))
          return
        }

        resolve(result as T)
      } catch {
        resolve(event.data as T)
      }
    }

    window.addEventListener("message", handleMessage)

    window.parent.postMessage(
      JSON.stringify({ fn }),
      "*"
    )
  })
}

function App() {
  const [treeText, setTreeText] = useState("")

  async function createTree() {
    const contents = await requestEarSketch<string>(
      "getEditorContents"
    )

    const tree = parser.parse(contents)

let outline = ""
let depth = 0

tree.iterate({
  enter(node) {
    const skip = ["(", ")", ",", ":", ";", "for", "in"]

    if (skip.includes(node.name)) {
      return
    }
    outline += "  ".repeat(depth) + node.name + `
`
    depth++
  },

  leave(node) {
    const skip = ["(", ")", ",", ":", ";", "for", "in"]

    if (skip.includes(node.name)) {
      return
    }

    depth--
  },
})

setTreeText(outline)}

  return (
    <main>
      <h1>Code Outline</h1>

      <button type="button" onClick={createTree}>
        Create Tree
      </button>

      <pre className="tree-output">
        {treeText || "The code outline will appear here"}
      </pre>
    </main>
  )
}

export default App