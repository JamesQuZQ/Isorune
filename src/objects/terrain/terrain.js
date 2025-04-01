import grassTexture from '@/assets/textures/grass.jpg';
import mountantRockTexture from '@/assets/textures/rock.jpg';
import rockTexture from '@/assets/textures/stone.png';
import soilTexture from '@/assets/textures/dirt.png';
import snowTexture from '@/assets/textures/snow.jpg';
import sandTexture from '@/assets/textures/sand.jpg';
import { Chunk } from '@/objects/terrain/chunk';
import { LoaderHelper } from '@/utils/loader_helper';
import { Noise } from '@/logics/noise';
import { Vector2 } from '@/utils/vector_helper';

/**
 * @namespace Terrain
 */

/** @import { Debugger } from '@/tools/debugger'*/
/** @import { BlockTypeContainer } from '@/objects/terrain/container'*/

//TODO:: for performance assets should load via a CDN

/**
 * @property {Map} chunks
 * @property {Map} #textures
 * */
export class Terrain {
  #textures;

  /** @type {import('@/logics/noise').NoiseProps} noiseConfig*/
  noiseConfig = {
    octaves: 4,
    scale: 250,
    persistant: 4,
    exponentiation: 3,
    lacunarity: 3,
  };

  debugProp = {
    LOD: 3, // Level Of Detail
    chunkSize: Terrain.TERRAIN_CHUNk_LIMIT,
    max_height: Terrain.TERRAIN_CHUNk_HEIGHT,
  };

  static TERRAIN_CHUNk_LIMIT = 20;
  static TERRAIN_CHUNk_HEIGHT = 70;

  /**
   * @param {Debugger} gui
   * */
  constructor(gui) {
    this.heightNoise = new Noise();
    this.chunks = new Map();
    this.#textures = new Map();

    this.InitDebugger(gui);
  }

  GetLevelOfDetail(LODOffSet) {
    return LODOffSet + 1 * LODOffSet == 0 ? 1 : LODOffSet + 1 * LODOffSet;
  }

  /** @param {Debugger} gui */
  InitDebugger(gui) {
    const chunkFolder = gui.addFolder('Chunk Config');

    const update = () => {
      this.DebugUpdate(this.GetLevelOfDetail(this.debugProp.LOD), this.debugProp.chunkSize);
    };

    chunkFolder.add(this.noiseConfig, 'octaves', 1, 5, 1).onChange(update);
    chunkFolder.add(this.noiseConfig, 'scale', 20, 100, 2).onChange(update);
    chunkFolder.add(this.noiseConfig, 'persistant', 0.1, 1, 0.1).onChange(update);
    chunkFolder.add(this.noiseConfig, 'lacunarity', 1, 10).onChange(update);
    chunkFolder.add(this.noiseConfig, 'exponentiation', 1, 7).onChange(update);
    chunkFolder.add(this.debugProp, 'LOD', 0, 4, 1).onChange(update);
    chunkFolder.add(this.debugProp, 'chunkSize', 30, 300, 10).onChange(update);
    chunkFolder.add(this.debugProp, 'max_height', 10, 100, 10).onChange(update);
  }

  async InitTextureAsync() {
    this.#textures['grass'] = await LoaderHelper.LoadTextureAsync(grassTexture);
    this.#textures['mountantRock'] = await LoaderHelper.LoadTextureAsync(mountantRockTexture);
    this.#textures['snow'] = await LoaderHelper.LoadTextureAsync(snowTexture);
    this.#textures['rock'] = await LoaderHelper.LoadTextureAsync(rockTexture);
    this.#textures['soil'] = await LoaderHelper.LoadTextureAsync(soilTexture);
    this.#textures['sand'] = await LoaderHelper.LoadTextureAsync(sandTexture);
  }

  async GetChunkBuilderAsync(edge, size, levelOfDetail) {
    const chunkBuilder = new Chunk(this.#textures, edge, size, this.envmap, levelOfDetail);

    return await chunkBuilder.CreateAsync(this.heightNoise, this.noiseConfig, this.debugProp.max_height);
  }

  /**
   * @param {Vector2} edge
   * @param {number} levelOfDetail
   * @param {Function} callback
   * */
  async AppendChunkAsync(edge, levelOfDetail = 2, callback) {
    const chunkBuilder = await this.GetChunkBuilderAsync(edge, this.debugProp.chunkSize, levelOfDetail);
    const chunk = await chunkBuilder.BuildAsync();
    this.chunks.set(chunk.coordinate.Tokey(), chunk);

    callback(chunk);
  }

  /**
   * @param {Vector2} coordinate
   * @param {number} levelOfDetail
   * @param {Function} addToApp
   * @param {Function} removeFromApp
   * */
  async UpdateChunkAsync(coordinate, levelOfDetail = 2, addToApp, removeFromApp) {
    this.DisposeChunk(this.chunks.get(coordinate.Tokey()), removeFromApp);

    const chunkBuilder = await this.GetChunkBuilderAsync(coordinate, Terrain.TERRAIN_CHUNk_LIMIT, levelOfDetail);
    const newChunk = await chunkBuilder.BuildAsync();

    this.chunks.set(newChunk.coordinate.Tokey(), newChunk);
    addToApp(newChunk);
  }

  /**
   * @param {Chunk} chunk
   * @param {Function} removeFromApp
   * */
  DisposeChunk(chunk, removeFromApp) {
    chunk.Hide();
    chunk.Dispose();
    removeFromApp(chunk);
    this.chunks.delete(chunk.coordinate.Tokey());
  }

  /**
   * @param {number} levelOfDetail
   * @param {number} chunkSize
   * */
  async DebugUpdate(levelOfDetail = 2, chunkSize) {
    await this.DisposeTerrain();
    await this.GenerateAsync(levelOfDetail, chunkSize);
  }

  /**
   * @param {Function} disposeMesh
   * */
  async DisposeTerrain(disposeMesh) {
    if (!this.chunks) return;

    for (const [_, chunk] of this.chunks) {
      chunk.children.forEach((geo) => {
        geo.material.dispose();
        geo.geometry.dispose();
      });

      disposeMesh(chunk);
    }

    this.chunks.clear();
  }
}
