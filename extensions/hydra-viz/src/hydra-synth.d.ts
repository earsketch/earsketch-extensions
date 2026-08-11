declare module "hydra-synth" {
  export interface HydraInput {
    init(options: { src: CanvasImageSource }): void
  }

  export interface HydraSource {
    color(red?: number, green?: number, blue?: number, alpha?: number): HydraSource
    kaleid(sides?: number): HydraSource
    modulate(source: HydraSource, amount?: number): HydraSource
    rotate(angle?: number, speed?: number): HydraSource
    out(output?: unknown): void
  }

  export interface HydraSynth {
    noise(scale?: number, offset?: number): HydraSource
    osc(frequency?: number, sync?: number, offset?: number): HydraSource
    src(source: HydraInput): HydraSource
    o0: unknown
    s0: HydraInput
  }

  export interface HydraOptions {
    autoLoop?: boolean
    canvas?: HTMLCanvasElement
    detectAudio?: boolean
    enableStreamCapture?: boolean
    height?: number
    makeGlobal?: boolean
    width?: number
  }

  export default class Hydra {
    constructor(options?: HydraOptions)

    readonly synth: HydraSynth
    readonly regl: { destroy(): void }

    hush(): void
    setResolution(width: number, height: number): void
    tick(deltaTime: number): void
  }
}
