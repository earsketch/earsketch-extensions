import { requestEarSketch } from "@earsketch/extension-sdk"
import { useEffect, useState } from "react"
import "./App.css"

function App() {
  const [code, setCode] = useState("")
  useEffect(() => {
    async function fetchCode() {
      const contents = await requestEarSketch<string>("getEditorContents")
      setCode(contents)
    }

    fetchCode()

    const interval = setInterval(() => {
      fetchCode()
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <main className="minimap-page">
      <h1>Code Minimap</h1>

      <pre className="minimap">{code || "Open an EarSketch script"}</pre>
    </main>
  )
}

export default App
