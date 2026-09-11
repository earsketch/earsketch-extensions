import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [tempo, setTempo] = useState(120)
  const nSteps = 16
  const groupSize = 4
  const pairSize = 2
  const audioCtxRef = useRef<AudioContext | null>(null)
  const currentBeatRef = useRef<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const [iBeat, setIBeat] = useState(0)
  const [steps, setSteps] = useState<boolean[]>([
    true, false, false, true, false, false, true, false,
    true, false, false, true, false, false, true, false,
  ])

  const playBeats = async (nextBeat: number) => {
    if (steps[nextBeat] && audioCtxRef.current) {
      try {
        const url = 'https://earsketch-test.ersktch.gatech.edu/backend-static/MakeBeat/OS_CLAP01.flac'
        const response = await fetch(url)
        const buffer = await response.arrayBuffer()
        const audioBuffer = await audioCtxRef.current.decodeAudioData(buffer)
        const source = audioCtxRef.current.createBufferSource()
        source.buffer = audioBuffer
        source.connect(audioCtxRef.current.destination)
        source.start()
      } catch (error) {
        console.error('Error loading sound:', error)
      }
    }
  }

  useEffect(() => {
    if (!isPlaying)
      return
    playBeats(currentBeatRef.current)
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying)
      return

    const period = 60 / tempo * 1000 / 4

    const intervalID = setInterval(() => {
      const nextBeat = (currentBeatRef.current + 1) % nSteps
      currentBeatRef.current = nextBeat
      playBeats(nextBeat)
      setIBeat(nextBeat)
    }, period)

    return () => {
      clearInterval(intervalID);
    };
  }, [isPlaying, tempo, steps]);

  function handlePlay() {
    if(!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    if (isPlaying) {
      currentBeatRef.current = 0
      setIBeat(0)
    }
    setIsPlaying(!isPlaying)
  }

  const beatString = steps.map(s => s ? '0' : '-').join('')
  const sound = 'OS_CLAP01'
  const track = 1
  const start = 1
  const earsketchCode = `sound = ${sound}\ntrack = ${track}\nstart = ${start}\nbeat = "${beatString}"\nmakeBeat(sound, track, start, beat)`

  return (
    <div className="page">
      <h1>Sequencer</h1>
      <p>A step sequencer for building beats inside EarSketch.</p>
      <div className="controls">
        <button onClick={() => handlePlay()}>{isPlaying ? 'Pause' : 'Play'}</button>
        <label>
          BPM:
          <input
            type="number"
            min={20}
            max={200}
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="sequencer-grid">
        <div className="track-row">
          <span className="track-label">Clap</span>
          <div className="track-cells">
            {Array.from({ length: nSteps / groupSize / pairSize }, (_, p) => (
              <div className="step-pair" key={p}>
                {Array.from({ length: pairSize }, (_, gj) => {
                  const g = p * pairSize + gj
                  return (
                    <div className="step-group" key={g}>
                      {Array.from({ length: groupSize }, (_, j) => {
                        const i = g * groupSize + j
                        return (
                          <button
                            key={i}
                            type="button"
                            className={`step ${steps[i] ? 'step-on' : ''} ${iBeat === i ? 'step-active' : ''}`}
                            aria-pressed={steps[i]}
                            onClick={() => {
                              const newSteps = [...steps]
                              newSteps[i] = !newSteps[i]
                              setSteps(newSteps)
                            }}
                          />
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <pre className="code-output">{earsketchCode}</pre>
    </div>
  )
}

export default App