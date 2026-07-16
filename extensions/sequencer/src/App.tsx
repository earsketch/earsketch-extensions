import './App.css'

function App() {
  function handleClick() {
    console.log('Button clicked!')
    const audioCtx = new AudioContext()
    const osc = audioCtx.createOscillator()
    osc.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 1)
    const osc2 = audioCtx.createOscillator()
    osc2.connect(audioCtx.destination)
    osc2.start(audioCtx.currentTime + 2)
    osc2.stop(audioCtx.currentTime + 3)
  }
  
  return (
    <div className="page">
      <h1>Sequencer</h1>
      <p>A step sequencer for building beats inside EarSketch.</p>
      <button onClick={() => handleClick()}>Click me</button>
    </div>
  )
}

export default App
