export interface EarSketchRequest {
  fn: string
}

export interface EarSketchErrorResponse {
  error: string
}

export interface PlaybackStatus {
  isPlaying: boolean
  lastChangeTimestamp: number
}

export interface EarSketchRequestOptions {
  targetOrigin?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isEarSketchErrorResponse(
  value: unknown,
): value is EarSketchErrorResponse {
  return isRecord(value) && typeof value.error === "string"
}

function parseResponse(data: unknown): unknown {
  if (typeof data !== "string") return data

  try {
    return JSON.parse(data) as unknown
  } catch {
    // Some API functions return an unencoded string directly.
    return data
  }
}

export function requestEarSketch<T>(
  fn: string,
  { targetOrigin = "*" }: EarSketchRequestOptions = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.source !== window.parent ||
        (targetOrigin !== "*" && event.origin !== targetOrigin)
      ) {
        return
      }

      window.removeEventListener("message", handleMessage)

      const response = parseResponse(event.data)

      if (isEarSketchErrorResponse(response)) {
        reject(new Error(response.error))
        return
      }

      resolve(response as T)
    }

    const request: EarSketchRequest = { fn }

    window.addEventListener("message", handleMessage)
    window.parent.postMessage(JSON.stringify(request), targetOrigin)
  })
}
