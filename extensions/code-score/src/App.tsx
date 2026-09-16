import { useEffect, useState } from "react"
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
          typeof event.data === "string" ? JSON.parse(event.data) : event.data

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

    window.parent.postMessage(JSON.stringify({ fn }), "*")
  })
}

function App() {
  const [loopCount, setLoopCount] = useState(0)
  const [conditionalCount, setConditionalCount] = useState(0)
  const [listCount, setListCount] = useState(0)
  const [variableCount, setVariableCount] = useState(0)
  const [popupTitle, setPopupTitle] = useState("")
  const [popupBadge, setPopupBadge] = useState("")
  const [shownAchievements, setShownAchievements] = useState<string[]>([])

  const achievements = [
    {
      title: "Variable Beginner",
      description: "Use at least 3 variables",
      badge: "🔤",
      earned: variableCount >= 3,
    },
    {
      title: "Loop Explorer",
      description: "Use at least 1 loop",
      badge: "🔁",
      earned: loopCount >= 1,
    },
    {
      title: "Logic Builder",
      description: "Use at least 1 conditional",
      badge: "🧠",
      earned: conditionalCount >= 1,
    },
    {
      title: "List User",
      description: "Use at least 1 list",
      badge: "📋",
      earned: listCount >= 1,
    },
  ]

  const earnedCount = achievements.filter(
    (achievement) => achievement.earned,
  ).length

  async function checkCode() {
    const contents = await requestEarSketch<string>("getEditorContents")

    const tree = parser.parse(contents)

    let loops = 0
    let conditionals = 0
    let lists = 0

    const variables = new Set<string>()

    tree.iterate({
      enter(node) {
        if (node.name === "ForStatement" || node.name === "WhileStatement") {
          loops++
        }

        if (node.name === "IfStatement") {
          conditionals++
        }

        if (node.name === "ArrayExpression") {
          lists++
        }

        if (node.name === "AssignStatement") {
          const assignment = contents.slice(node.from, node.to)
          const variableName = assignment.split("=")[0].trim()

          variables.add(variableName)
        }
      },
    })

    setLoopCount(loops)
    setConditionalCount(conditionals)
    setListCount(lists)
    setVariableCount(variables.size)

    let newTitle = ""
    let newBadge = ""

    if (
      variables.size >= 3 &&
      !shownAchievements.includes("Variable Beginner")
    ) {
      newTitle = "Variable Beginner"
      newBadge = "🔤"
    } else if (loops >= 1 && !shownAchievements.includes("Loop Explorer")) {
      newTitle = "Loop Explorer"
      newBadge = "🔁"
    } else if (
      conditionals >= 1 &&
      !shownAchievements.includes("Logic Builder")
    ) {
      newTitle = "Logic Builder"
      newBadge = "🧠"
    } else if (lists >= 1 && !shownAchievements.includes("List User")) {
      newTitle = "List User"
      newBadge = "📋"
    }

    if (newTitle !== "") {
      setPopupTitle(newTitle)
      setPopupBadge(newBadge)

      setShownAchievements([...shownAchievements, newTitle])

      setTimeout(() => {
        setPopupTitle("")
      }, 5000)
    }
  }

  useEffect(() => {
    checkCode()

    const interval = setInterval(() => {
      checkCode()
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [shownAchievements])

  return (
    <main className="code-score-page">
      {popupTitle && (
        <div className="achievement-popup">
          <div className="popup-badge">{popupBadge}</div>

          <div>
            <p>ACHIEVEMENT UNLOCKED!</p>
            <h3>{popupTitle}</h3>
          </div>
        </div>
      )}

      <h1>Code Score</h1>

      <div className="score-box">
        <span className="score-number">
          {earnedCount} / {achievements.length}
        </span>

        <span className="score-label">Achievements</span>
      </div>

      <h2>Statistics</h2>

      <div className="stat-row">
        <span>Loops</span>
        <strong>{loopCount}</strong>
      </div>

      <div className="stat-row">
        <span>Conditionals</span>
        <strong>{conditionalCount}</strong>
      </div>

      <div className="stat-row">
        <span>Lists</span>
        <strong>{listCount}</strong>
      </div>

      <div className="stat-row">
        <span>Variables</span>
        <strong>{variableCount}</strong>
      </div>

      <h2>Achievements</h2>

      <div className="achievement-list">
        {achievements.map((achievement) => (
          <div
            key={achievement.title}
            className={
              achievement.earned
                ? "achievement-card earned"
                : "achievement-card locked"
            }
          >
            <div className="badge-circle">
              {achievement.earned ? achievement.badge : "🔒"}
            </div>

            <div className="achievement-info">
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default App
