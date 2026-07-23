import { useCallback, useEffect, useState, type CSSProperties } from "react"

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

interface EditorDanceStyle extends CSSProperties {
  "--dance-left": string
  "--dance-right": string
  "--dance-rise": string
  "--dance-rebound": string
  "--editor-background": string
  "--editor-foreground": string
}

const stillEditorStyle: EditorDanceStyle = {
  "--dance-left": "-4px",
  "--dance-right": "4px",
  "--dance-rise": "-12px",
  "--dance-rebound": "-8px",
  "--editor-background": "#ffffff",
  "--editor-foreground": "#b79a6b",
}

function seededRandom(seed: number) {
  let value = Math.trunc(seed) | 0

  return () => {
    value += 0x6d2b79f5
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

function getEditorDanceStyle(playback: PlaybackStatus | null): EditorDanceStyle {
  if (!playback?.isPlaying) return stillEditorStyle

  const random = seededRandom(playback.lastChangeTimestamp)
  const horizontalMovement = 3 + random() * 2
  const rise = 10 + random() * 5
  const backgroundHue = Math.round(random() * 360)
  const foregroundHue = Math.round(random() * 360)

  return {
    "--dance-left": `${-horizontalMovement.toFixed(2)}px`,
    "--dance-right": `${horizontalMovement.toFixed(2)}px`,
    "--dance-rise": `${-rise.toFixed(2)}px`,
    "--dance-rebound": `${-(rise * 0.67).toFixed(2)}px`,
    "--editor-background": `hsl(${backgroundHue} 65% 92%)`,
    "--editor-foreground": `hsl(${foregroundHue} 55% 28%)`,
  }
}

// Replace this with the origin hosting EarSketch.
// const EARSKETCH_ORIGIN = "https://earsketch.gatech.edu"

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
  const editorDanceStyle = getEditorDanceStyle(playback)

  const refresh = useCallback(async () => {
    try {
      // Query sequentially because the current API responses do not include
      // request IDs for matching concurrent requests.
      const contents = await requestEarSketch<string>(
        "getEditorContents"
      )

      const playbackStatus =
        await requestEarSketch<PlaybackStatus>(
          "getPlaybackStatus"
        )

      setError(null)
      setEditorContents(contents)
      setPlayback(playbackStatus)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "EarSketch request failed"
      )
    }
  }, [])

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => {
      void refresh()
    }, 0)

    // Poll if the extension should stay synchronized with EarSketch.
    const interval = window.setInterval(() => {
      void refresh()
    }, 1000)

    return () => {
      window.clearTimeout(initialRefresh)
      window.clearInterval(interval)
    }
  }, [refresh])

  return (
    <main>
      {error && <p role="alert">{error}</p>}

      <section>
        {/* <h2>Editor contents</h2> */}
        <pre
          className={`editor-contents${
            playback?.isPlaying ? " editor-contents--playing" : ""
          }`}
          style={editorDanceStyle}
        >
          <code>{editorContents}</code>
        </pre>
      </section>
    </main>
  )
}
