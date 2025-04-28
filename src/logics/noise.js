import { SimplexNoise } from 'three/examples/jsm/Addons.js';

//NOTE: This Noice class not only help me to create terrain surface but also can build world contents

/**
 * @namespace Noise
 * */

/**
 *  @typedef {Object} NoiseProps
 *  @memberof Noise
 *  @property {number} octaves
 *  @property {number} scale
 *  @property {number} exponentiation
 *  @property {number} persistant
 *  @property {number} lacunarity
 *
 * */

export class Noise {
  constructor() {
    this.seed = new SimplexNoise();
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {NoiseProps} property
   *
   * @return {number} */
  Get2D(x, y, property) {
    const xoff = x / property.scale;
    const yoff = y / property.scale;
    let total = 0;
    let amplitude = 1;
    let frequency = 1;
    let normalization = 0;
    for (let octave = 0; octave < property.octaves; octave++) {
      const noiseValue =
        this.seed.noise(xoff * frequency, yoff * frequency) * 0.5 + 0.5;
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= 2.0 ** -property.persistant;
      frequency *= property.lacunarity;
    }

    total /= normalization;
    return total ** property.exponentiation;
  }
}
