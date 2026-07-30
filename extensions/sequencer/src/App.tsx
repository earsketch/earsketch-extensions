import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [numOscillators, setNumOscillators] = useState(1)
  const tempo = 120
  const nSteps = 16
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const [iBeat, setIBeat] = useState(0)
  const [steps, setSteps] = useState<boolean[]>([
    true, false, false, true, false, false, true, false,
    true, false, false, true, false, false, true, false,
  ])

  useEffect(() => {
    if (!isPlaying) 
      return
    const period = 60 / tempo * 1000 // in milliseconds
    const intervalID = setInterval(myCallback, period);

    function myCallback() {
    setIBeat((prev) => (prev + 1) % nSteps);
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    const audioCtx = audioCtxRef.current
    const noteDuration = 0.5

    if (steps[iBeat]) {
      const osc = audioCtx.createOscillator()
      osc.connect(audioCtx.destination)
      const startTime = audioCtx.currentTime
      osc.start(startTime)
      osc.stop(startTime + noteDuration)
    }
  }
    return () => {
      clearInterval(intervalID);
    };
  }, [iBeat, steps, isPlaying]);

  function handlePlay() {
    setIsPlaying(!isPlaying)
    const audioCtx = new AudioContext()
    audioCtxRef.current = audioCtx
    const noteDuration = 0.5

    for (let i = 0; i < numOscillators; i++) {
      const osc = audioCtx.createOscillator()
      osc.connect(audioCtx.destination)
      const startTime = audioCtx.currentTime + i * 0.75
      osc.start(startTime)
      osc.stop(startTime + noteDuration)
    }
  }
  
  return (
    <div className="page">
      <h1>Sequencer</h1>
      <p>A step sequencer for building beats inside EarSketch.</p>
      {Array.from({ length: nSteps }, (_, i) => (
      <input
        key={i}
        type="checkbox"
        checked={steps[i]}
        onChange={() => {
          const newSteps = [...steps]
          newSteps[i] = !newSteps[i]
          setSteps(newSteps)
        }}
      />))}
        {JSON.stringify(steps)}
        {JSON.stringify(iBeat)}
      <button onClick={() => handlePlay()}>Play/Pause</button>
      {JSON.stringify(isPlaying)}
    </div>
  )
}

export default App
