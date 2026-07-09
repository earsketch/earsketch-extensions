import { useState } from "react"
import "./App.css"

const tips = [
  "You can change the editor font size from the menu at the top of EarSketch.",
  "You can preview a sound before adding it to your script.",
  "You can use fitMedia() to place a sound on a track between two measures.",
  "You can use makeBeat() to create custom drum and percussion patterns.",
  "You can hover over a sound in the Sound Browser to see additional information.",
  "Use the search bar to quickly find sounds by name.",
  "You can click the ★ next to a sound to add it to your favorites.",
  "Keyboard shortcuts are available from the keyboard icon at the top of EarSketch.",
  "You can create multiple scripts and switch between them at any time.",
  "The Curriculum panel includes tutorials and coding challenges.",
  "Use different tracks to layer instruments and create richer songs.",
  "You can use setTempo() to choose any tempo between 45 and 220 BPM.",
  "Open example scripts to learn how different EarSketch projects are built.",
  "Drag the divider between panels to resize your workspace.",
  "You can reuse the same sound on multiple tracks.",
]

function App() {
  const [tipIndex, setTipIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(true)

  function showNextTip() {
    if (tipIndex < tips.length - 1) {
      setTipIndex(tipIndex + 1)
    } else {
      setTipIndex(0)
    }
  }

  function showPreviousTip() {
    if (tipIndex > 0) {
      setTipIndex(tipIndex - 1)
    } else {
      setTipIndex(tips.length - 1)
    }
  }

  if (!isOpen) {
  return null
}
  return (
    <main className="tip-page">
      <section className="tip-card">
        <div className="tip-heading">
          <span className="tip-icon">💡</span>

          <div className="tip-title">
            <p className="line">TIP OF THE DAY</p>
            <h1>Did you know?</h1>
          </div>
        </div>

        <p className="tip-text">{tips[tipIndex]}</p>

        <div className="tip-bottom">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>

          <div className="tip-buttons">
            <button type="button" onClick={showPreviousTip}>
              Previous Tip
            </button>

            <button type="button" onClick={showNextTip}>
              Next Tip
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App