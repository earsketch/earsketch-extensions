import type { HydraSynth } from "hydra-synth"

export function runHydraSketch(synth: HydraSynth) {
  synth
    .osc(12, 0.2, 1)
    .brightness(0.3)
    .rotate(0, 0.08)
    .modulate(synth.noise(3, 0.15), 0.2)
    .modulate(synth.osc())
    .out(synth.o0)
}
