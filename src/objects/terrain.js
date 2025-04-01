import grassTexture from '@/assets/textures/grass.jpg';
import mountantRockTexture from '@/assets/textures/rock.jpg';
import rockTexture from '@/assets/textures/stone.png';
import soilTexture from '@/assets/textures/dirt.png';
import snowTexture from '@/assets/textures/snow.jpg';
import sandTexture from '@/assets/textures/sand.jpg';
import { LoaderHelper } from '@/utils/loader_helper';
import { Chunk } from '@/objects/terrain_chunk';
import { Noise } from '@/logics/noise';
import { Vector2 } from 'three';

//TODO:: for performance assets should load via a CDN

export class Terrain {
  #textures;
  constructor(params) {
    this.heightNoise = new Noise();
    this.chunks = [];
    this.#textures = {};
    this.#Init(params);
  }

  get width_limit() {
    return 200;
  }

  get height_limit() {
    return 200;
  }

  #Init(params) {
    this.#InitTexture(params);
  }

  #InitTexture() {
    this.#textures['grass'] = LoaderHelper.LoadTexture(grassTexture);
    this.#textures['mountantRock'] =
      LoaderHelper.LoadTexture(mountantRockTexture);
    this.#textures['snow'] = LoaderHelper.LoadTexture(snowTexture);
    this.#textures['rock'] = LoaderHelper.LoadTexture(rockTexture);
    this.#textures['soil'] = LoaderHelper.LoadTexture(soilTexture);
    this.#textures['sand'] = LoaderHelper.LoadTexture(sandTexture);
  }

  GetTexture(key) {
    return this.#textures[key];
  }

  CreateChunk(edge, size) {
    const chunk = new Chunk(
      this.#textures,
      new Vector2(0, 0),
      new Vector2(10, 10),
      this.envmap,
    );

    return chunk.Create(this.heightNoise);
  }
}
