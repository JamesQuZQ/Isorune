import grassTexture from '@/assets/textures/grass.jpg';
import mountantRockTexture from '@/assets/textures/rock.jpg';
import rockTexture from '@/assets/textures/stone.png';
import soilTexture from '@/assets/textures/dirt.png';
import snowTexture from '@/assets/textures/snow.jpg';
import sandTexture from '@/assets/textures/sand.jpg';
import { Chunk } from '@/objects/terrain/chunk';
import { LoaderHelper } from '@/utils/loader_helper';
import { Noise } from '@/logics/noise';
import { Group, Vector2 } from 'three';
import { App } from '@/core/app';

/**
 * @namespace Terrain
 */

/** @import { Debugger } from '@/tools/debugger'*/
/** @import { BlockTypeContainer } from '@/objects/terrain/container'*/

//TODO:: for performance assets should load via a CDN

export class Terrain {
  #textures;

  /** @type {import('@/logics/noise').NoiseProps}*/
  noiseConfig = {
    octaves: 1,
    scale: 50,
    persistant: 0.2,
    exponentiation: 7,
    lacunarity: 1,
  };

  debugProp = {
    levelOfDetail: 2,
    chunkSize: 50,
    max_height: 50,
  };

  static TERRAIN_CHUNk_LIMIT = 51;

  /**
   * @param {Debugger} gui
   * @property {Group[]} chunks
   * */
  constructor(gui) {
    this.app = new App();
    this.heightNoise = new Noise();
    this.chunks = [];
    this.#textures = {};

    this.InitDebugger(gui);
  }

  /** @param {Debugger} gui */
  InitDebugger(gui) {
    const chunkFolder = gui.addFolder('Chunk Config');

    const update = () => {
      this.Update(this.debugProp.levelOfDetail, this.debugProp.chunkSize);
    };

    chunkFolder.add(this.noiseConfig, 'octaves', 1, 5, 1).onChange(update);
    chunkFolder.add(this.noiseConfig, 'scale', 20, 100, 2).onChange(update);
    chunkFolder.add(this.noiseConfig, 'persistant', 0.1, 1, 0.1).onChange(update);
    chunkFolder.add(this.noiseConfig, 'lacunarity', 1, 10).onChange(update);
    chunkFolder.add(this.noiseConfig, 'exponentiation', 1, 7).onChange(update);
    chunkFolder.add(this.debugProp, 'levelOfDetail', 2, 8, 2).onChange(update);
    chunkFolder.add(this.debugProp, 'chunkSize', 30, 100, 10).onChange(update);
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

  async CreateChunkAsync(edge, size, levelOfDetail) {
    const chunk = new Chunk(this.#textures, edge, size, this.envmap, levelOfDetail);
    return await chunk.CreateAsync(this.heightNoise, this.noiseConfig, this.debugProp.max_height);
  }

  /** Generate init chunk at the x = 0, y = 0
   *
   * @param {number} levelOfDetail
   * @param {number} chunkSize
   * */
  async GenerateAsync(levelOfDetail = 1, chunkSize = Terrain.TERRAIN_CHUNk_LIMIT) {
    const chunk = await this.CreateChunkAsync(new Vector2(0, 0), chunkSize, levelOfDetail);
    await this.#LoadContainers(chunk);
  }

  /**
   * @param {Vector2} edge
   * @param {number} size
   * @param {number} levelOfDetail
   * */
  async Append(edge, size, levelOfDetail) {
    const chunk = await this.CreateChunkAsync(edge, Math.min(size, Terrain.TERRAIN_CHUNk_LIMIT), levelOfDetail);
  }

  /**
   * @param {number} levelOfDetail
   * @param {number} chunkSize
   * */
  async Update(levelOfDetail = 2, chunkSize) {
    await this.DisposeTerrain();
    await this.GenerateAsync(levelOfDetail, chunkSize);
  }

  async DisposeTerrain() {
    if (!this.chunks) return;

    this.chunks.forEach((/** @type {Group} chunk */ chunk) => {
      chunk.children.forEach((geo) => {
        geo.material.dispose();
        geo.geometry.dispose();
      });

      this.app.DisposeMesh(chunk);
    });

    this.chunks = [];
  }

  async DisposeChunk() {}

  /**
   * @param {Chunk} chunk
   * */
  async #LoadContainers(chunk) {
    const group = new Group();

    for (const [_, value] of Object.entries(chunk.blockTypes)) {
      /** @type {BlockTypeContainer} geoContainer*/
      const geoContainer = await value.BuildAsync();
      group.add(geoContainer.mesh);
    }

    this.chunks.push(group);

    group.Tick = (delta) => {
      group.rotateY(delta * 0.25);
    };

    group.receiveShadow = true;

    await this.app.AddAsync(group);
    this.app.Render();
  }
}
