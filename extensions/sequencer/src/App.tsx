import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
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
    const period = 60 / tempo * 1000 

    const intervalID = setInterval(() => {
      setIBeat((prevBeat) => {
        const nextBeat = (prevBeat + 1) % nSteps

        if (steps[nextBeat] && audioCtxRef.current) {
          const osc = audioCtxRef.current.createOscillator()
          osc.connect(audioCtxRef.current.destination)
          osc.start()
          osc.stop(audioCtxRef.current.currentTime + 0.1)
        }

        return nextBeat
      })
    }, period)

    return () => {
      clearInterval(intervalID);
    };
  }, [isPlaying, steps]);

  function handlePlay() {
    if(!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    setIsPlaying(!isPlaying)
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
      <div style ={{ backgroundColor: isPlaying ? 'lightgreen' : 'lightcoral' }}>
        test
      </div>
    </div>
  )
}

export default App