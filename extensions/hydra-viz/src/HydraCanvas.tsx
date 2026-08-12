import { useEffect, useRef } from "react"
import Hydra from "hydra-synth"

interface HydraCanvasProps {
  text: string
}

function drawText(canvas: HTMLCanvasElement, text: string) {
  const context = canvas.getContext("2d")
  if (!context) return

  const hasRealLineBreaks = /[\r\n]/.test(text)
  const lines = hasRealLineBreaks
    ? text.split(/\r\n?|\n/)
    : text.split(/\\r\\n|\\n|\\r/)
  const padding = 40
  const availableWidth = canvas.width - padding * 2
  const availableHeight = canvas.height - padding * 2
  const lineHeightRatio = 1.25
  const minimumFontSize = 12
  let fontSize = Math.min(
    48,
    availableHeight / Math.max(lines.length * lineHeightRatio, 1),
  )

  const setFont = () => {
    context.font = `600 ${fontSize}px monospace`
  }

  setFont()
  while (
    fontSize > minimumFontSize &&
    lines.some((line) => context.measureText(line).width > availableWidth)
  ) {
    fontSize -= 1
    setFont()
  }

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = "white"
  context.textAlign = "left"
  context.textBaseline = "top"

  const lineHeight = fontSize * lineHeightRatio
  lines.forEach((line, index) => {
    context.fillText(line, padding, padding + index * lineHeight)
  })
}

export function HydraCanvas({ text }: HydraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const textCanvas = document.createElement("canvas")
    textCanvas.width = 1024
    textCanvas.height = 512
    textCanvasRef.current = textCanvas

    const hydra = new Hydra({
      autoLoop: false,
      canvas,
      detectAudio: false,
      enableStreamCapture: false,
      makeGlobal: false,
    })

    const synth = hydra.synth
    synth
      .osc(12, 0.2, 1)
      .brightness(0.3)
      .rotate(0, 0.08)
      .modulate(synth.noise(3, 0.15), 0.2)
      .modulate(synth.osc())
      .out(synth.o0)

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(window.devicePixelRatio, 2)
      const width = Math.max(1, Math.round(bounds.width * pixelRatio))
      const height = Math.max(1, Math.round(bounds.height * pixelRatio))

      if (canvas.width !== width || canvas.height !== height) {
        hydra.setResolution(width, height)
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    resize()

    let animationFrame = 0
    let previousTime = performance.now()

    const render = (currentTime: number) => {
      hydra.tick(currentTime - previousTime)
      previousTime = currentTime
      animationFrame = requestAnimationFrame(render)
    }

    animationFrame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      hydra.hush()
      hydra.regl.destroy()
      textCanvasRef.current = null
    }
  }, [])

  useEffect(() => {
    const textCanvas = textCanvasRef.current
    if (textCanvas) drawText(textCanvas, text)
  }, [text])

  return (
    <section className="hydra-visual" aria-label={`Hydra visualization of ${text}`}>
      <canvas ref={canvasRef} className="hydra-canvas" />
    </section>
  )
}
