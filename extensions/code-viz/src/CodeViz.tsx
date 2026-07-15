import { useCallback, useEffect, useState } from "react"

function useExtCommsLogger() {
  return useEffect(() => {
  const onMessage = (event: MessageEvent) => {
    console.log("[CodeViz] message received", {
      origin: event.origin,
      data: event.data,
      sourceIsParent: event.source === window.parent,
    })
  }

  window.addEventListener("message", onMessage)
  return () => window.removeEventListener("message", onMessage)
}, [])
}

export function CodeViz() {
  useExtCommsLogger()
  return (
    <EarSketchStatus />
  )
}

interface PlaybackStatus {
  isPlaying: boolean
  lastChangeTimestamp: number
}

// Replace this with the origin hosting EarSketch.
// const EARSKE​TCH_ORIGIN = "https://earsketch.gatech.edu"

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

export function EarSketchStatus() {
  const [editorContents, setEditorContents] = useState("")
  const [playback, setPlayback] = useState<PlaybackStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)

      // Query sequentially because the current API responses do not include
      // request IDs for matching concurrent requests.
      const contents = await requestEarSketch<string>(
        "getEditorContents"
      )

      const playbackStatus =
        await requestEarSketch<PlaybackStatus>(
          "getPlaybackStatus"
        )

      setEditorContents(contents)
      setPlayback(playbackStatus)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "EarSketch request failed"
      )
    }
  }, [])

  useEffect(() => {
    void refresh()

    // Poll if the extension should stay synchronized with EarSketch.
    const interval = window.setInterval(() => {
      void refresh()
    }, 1000)

    return () => window.clearInterval(interval)
  }, [refresh])

  return (
    <main>
      <button type="button" onClick={() => void refresh()}>
        Refresh
      </button>

      {error && <p role="alert">{error}</p>}

      <section>
        <h2>Playback</h2>

        {playback ? (
          <>
            <p>{playback.isPlaying ? "Playing" : "Paused"}</p>
            <p>
              Last changed:{" "}
              {new Date(
                playback.lastChangeTimestamp
              ).toLocaleString()}
            </p>
          </>
        ) : (
          <p>Loading playback status…</p>
        )}
      </section>

      <section>
        <h2>Editor contents</h2>
        <pre>
          <code>{editorContents}</code>
        </pre>
      </section>
    </main>
  )
}
