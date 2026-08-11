import { useEffect, useState } from 'react'
import './App.css'

function requestEarSketch<T>(fn: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.source !== window.parent
        // || event.origin !== "http://localhost:5173" // TODO whats wrong here
      ) {
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
        // getEditorContents returns the script directly, which might not be JSON.
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
  const [code, setCode] = useState("")
  async function fetchCode() {
    const contents = await requestEarSketch<string>(
      "getEditorContents"
    )

    setCode(contents)
  }

  useEffect(() => { fetchCode()

    const interval = setInterval(() => {fetchCode()}, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <main className="minimap-page">
      <h1>Code Minimap</h1>

      <pre className="minimap">
        {code || "Open an EarSketch script"}
      </pre>
    </main>
  )
}

export default App