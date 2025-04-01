import { SimplexNoise } from 'three/examples/jsm/Addons.js';

//NOTE: This Noice class not only help me to create terrain surface but also can build world contents

export class Noise {
  constructor() {
    this.seed = new SimplexNoise();
    this.scale = 45;
    this.exponentiation = 7; //number of change in a certain area
    this.persistant = 0.2;
    this.lacunarity = 5;
    this.octaves = 1;
    this.max_height = 70;
  }

  WithConfig(gui) {
    this.folder = gui.addFolder('Noise');

    return this;
  }

  GetOctave(x, y) {
    const xoff = x / this.scale;
    const yoff = y / this.scale;
    let total = 0;
    let amplitude = 1;
    let frequency = 1;
    let normalization = 0;
    for (let octave = 0; octave < this.octaves; octave++) {
      const noiseValue =
        this.seed.noise(xoff * frequency, yoff * frequency) * 0.5 + 0.5;
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= this.persistant;
      frequency *= this.lacunarity;
    }

    total = total / normalization;
    return Math.pow(total, this.exponentiation) * this.max_height;
  }

  Get2D(x, y) {
    const xoff = x / this.scale;
    const yoff = y / this.scale;
    const frequency = 0.03;
    const noiseValue =
      (this.seed.noise(xoff * frequency, yoff * frequency) + 1) * 0.5;
    return Math.pow(noiseValue, this.exponentiation) * this.max_height;
  }
}
