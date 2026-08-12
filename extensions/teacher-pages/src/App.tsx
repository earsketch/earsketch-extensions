import { useState } from "react"
import type { FormEvent } from "react"

function App() {
  const [url, setUrl] = useState("")
  const [displayedUrl, setDisplayedUrl] = useState("")

  const displayPage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDisplayedUrl(url)
  }

  return (
    <main>
      <form onSubmit={displayPage}>
        <label htmlFor="page-url">Page URL</label>
        <div className="url-controls">
          <input
            id="page-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            required
          />
          <button type="submit">Display</button>
        </div>
      </form>

      {displayedUrl ? (
        <iframe src={displayedUrl} title="Teacher page" />
      ) : (
        <div className="empty-state">
          Enter a URL to display a teacher page.
        </div>
      )}
    </main>
  )
}

export default App
