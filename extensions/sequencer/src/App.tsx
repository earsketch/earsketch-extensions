import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [tempo, setTempo] = useState(120)
  const nSteps = 16
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

  function handleStepClick(index: number) {
    const newSteps = [...steps]
    newSteps[index] = !newSteps[index]
    setSteps(newSteps)
  }

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
      <div className="sequencer">
        <div id="grid" className="grid">
            {Array.from({ length: nSteps },(_, i) => (
            <button className={`step ${steps[i] ? 'step-on' : ''} ${iBeat === i ? 'step-active' : ''}`} key={i} onClick={() => handleStepClick(i)}>
            </button>
          ))}
      </div>
      <pre className="code-output">{earsketchCode}</pre>
    </div>
    </div>
  )
}

export default App