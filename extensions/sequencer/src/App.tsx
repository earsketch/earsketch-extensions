import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const tempo = 90
  const nSteps = 16
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const [iBeat, setIBeat] = useState(0)
  const [steps, setSteps] = useState<boolean[]>([
    true, false, false, true, false, false, true, false,
    true, false, false, true, false, false, true, false,
  ])

  // async function playBeats() {
  //   if (steps[nextBeat] && audioCtxRef.current) {
  //     try{
  //       const url = 'https://earsketch-test.ersktch.gatech.edu/backend-static/MakeBeat/OS_CLAP01.flac'
  //       const response = await fetch(url)
  //       const buffer = await response.arrayBuffer()
  //       const audioBuffer = await audioCtxRef.current.decodeAudioData(buffer)
  //       const source = audioCtxRef.current!.createBufferSource()
  //       source.buffer = audioBuffer
  //       source.connect(audioCtxRef.current!.destination)
  //       source.start()
  //     } catch (error) {
  //       console.error('Error loading sound:', error)
  //     }
  //     // const osc = audioCtxRef.current.createOscillator()
  //     // osc.connect(audioCtxRef.current.destination)
  //     // osc.start()
  //     // osc.stop(audioCtxRef.current.currentTime + 0.1)
  //   }
  //   return nextBeat
  // }

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
      // const osc = audioCtxRef.current.createOscillator()
      // osc.connect(audioCtxRef.current.destination)
      // osc.start()
      // osc.stop(audioCtxRef.current.currentTime + 0.1)
    }
  }

  useEffect(() => {
    if (!isPlaying) 
      return

    const period = 60 / tempo * 1000 / 4

    const intervalID = setInterval(() => {
      setIBeat((prevBeat) => {
        const nextBeat = (prevBeat + 1) % nSteps
        playBeats(nextBeat)
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
      <div className="sequencer-grid">
        <div className="track-row">
          <span className="track-label">Oscillator</span>
          <div className="track-cells">
            {Array.from({ length: nSteps }, (_, i) => (
              <button
                key={i}
                type="button"
                className={steps[i] ? 'step step-on' : 'step'}
                aria-pressed={steps[i]}
                onClick={() => {
                  const newSteps = [...steps]
                  newSteps[i] = !newSteps[i]
                  setSteps(newSteps)
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* {JSON.stringify(steps)} */}
      {JSON.stringify(iBeat)}
      <button onClick={() => handlePlay()}>{isPlaying ? 'Pause' : 'Play'}</button>
      {/* <div style ={{ backgroundColor: isPlaying ? 'lightgreen' : 'lightcoral' }}>
        test
      </div> */}
    </div>
  )
}

export default App