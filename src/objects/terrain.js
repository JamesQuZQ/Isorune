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

/** @import {App} from '@/core/app' */
//TODO:: for performance assets should load via a CDN

export class Terrain {
  #textures;

  static TERRAIN_CHUNk_LIMIT = 51;
  constructor() {
    this.heightNoise = new Noise();
    this.chunks = [];
    this.#textures = {};
  }

  async InitTextureAsync() {
    this.#textures['grass'] = await LoaderHelper.LoadTextureAsync(grassTexture);
    this.#textures['mountantRock'] =
      await LoaderHelper.LoadTextureAsync(mountantRockTexture);
    this.#textures['snow'] = await LoaderHelper.LoadTextureAsync(snowTexture);
    this.#textures['rock'] = await LoaderHelper.LoadTextureAsync(rockTexture);
    this.#textures['soil'] = await LoaderHelper.LoadTextureAsync(soilTexture);
    this.#textures['sand'] = await LoaderHelper.LoadTextureAsync(sandTexture);
  }

  async CreateChunkAsync(edge, size, levelOfDetail) {
    const chunk = new Chunk(
      this.#textures,
      edge,
      size,
      this.envmap,
      levelOfDetail,
    );

    return chunk.CreateChunkAsync(this.heightNoise);
  }

  /** @param {App} app */
  async GenerateAsync(app) {
    const terrain_chunk = await this.CreateChunkAsync(
      new Vector2(0, 0),
      Terrain.TERRAIN_CHUNk_LIMIT,
      2,
    );
    for (const [_, value] of Object.entries(terrain_chunk.blockTypes)) {
      const geoContainer = await value.BuildAsync();
      await app.AddMeshAsync(geoContainer);
    }
  }
}
