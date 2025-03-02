import { SimplexNoise } from "three/examples/jsm/Addons.js";

//NOTE: This Noice class not only help me to create terrain surface but also can build world contents

export class Noise {
  constructor() {
    this.seed = new SimplexNoise();
    this.scale = 1.0;
    this.exponentiation = 1;
    this.persistant = 1;
    this.lacunarity = 1;
    this.octaves = 10;
    this.terrain_max_height;
  }

  GetConfig(gui) {
    this.folder = gui.addFolder("Noise");
  }

  Get2D(x, y) {
    const xoff = x / this.scale;
    const yoff = y / this.scale;
    const total = 0.0;
    const amplitude = 1.0;
    const frequency = 1.0;
    const normalization = 0;
    for (let octave = 0; octave < this.octaves; octave++) {
      const noiseValue =
        this.seed.noise(xoff * frequency, yoff * frequency) * 0.5 + 0.5;
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= this.persistant;
      frequency *= this.lacunarity;
    }
    total = total / normalization;
    return Math.pow(total, this.exponentiation);
  }
}
