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
  #textures = new Map();
  blocks = new Map();

  /** @type {import('@/logics/noise').NoiseProps} noiseConfig*/
  noiseConfig = {
    octaves: 3,
    scale: 150,
    persistant: 2,
    exponentiation: 3,
    lacunarity: 3,
  };

  debugProp = {
    LOD: 3, // Level Of Detail
    chunkSize: Terrain.TERRAIN_CHUNk_LIMIT,
    max_height: Terrain.TERRAIN_CHUNk_HEIGHT,
  };

  static TERRAIN_CHUNk_LIMIT = 100;
  static TERRAIN_CHUNk_HEIGHT = 150;

  /**
   * @param {Debugger} gui
   * */
  constructor(gui) {
    this.heightNoise = new Noise();
    this.chunks = new Map();
    // this.InitDebugger(gui);
    this.rendered = false;
  }

  /** @param {Debugger} gui */
  InitDebugger(gui) {
    const chunkFolder = gui.addFolder('Chunk Config');

    const update = () => {
      this.DebugUpdate(
        this.GetLevelOfDetail(this.debugProp.LOD),
        this.debugProp.chunkSize,
      );
    };

    chunkFolder.add(this.noiseConfig, 'octaves', 1, 5, 1).onChange(update);
    chunkFolder.add(this.noiseConfig, 'scale', 20, 100, 2).onChange(update);
    chunkFolder
      .add(this.noiseConfig, 'persistant', 0.1, 1, 0.1)
      .onChange(update);
    chunkFolder.add(this.noiseConfig, 'lacunarity', 1, 10).onChange(update);
    chunkFolder.add(this.noiseConfig, 'exponentiation', 1, 7).onChange(update);
    chunkFolder.add(this.debugProp, 'LOD', 0, 4, 1).onChange(update);
    chunkFolder.add(this.debugProp, 'chunkSize', 30, 300, 10).onChange(update);
    chunkFolder.add(this.debugProp, 'max_height', 10, 100, 10).onChange(update);
  }

  async InitTextureAsync() {
    this.#textures.set(
      'grass',
      await LoaderHelper.LoadTextureAsync(grassTexture),
    );
    this.#textures.set(
      'mountantRock',
      await LoaderHelper.LoadTextureAsync(mountantRockTexture),
    );
    this.#textures.set(
      'snow',
      await LoaderHelper.LoadTextureAsync(snowTexture),
    );
    this.#textures.set(
      'rock',
      await LoaderHelper.LoadTextureAsync(rockTexture),
    );
    this.#textures.set(
      'soil',
      await LoaderHelper.LoadTextureAsync(soilTexture),
    );
    this.#textures.set(
      'sand',
      await LoaderHelper.LoadTextureAsync(sandTexture),
    );
  }

  async GetChunkBuilderAsync(coordinate, size, levelOfDetail) {
    const chunkBuilder = new Chunk(
      coordinate,
      size,
      levelOfDetail,
      this.debugProp.max_height,
    );

    return await chunkBuilder.GenerateAsync(
      this.heightNoise,
      this.noiseConfig,
      this.blocks,
    );
  }

  /**
   * @param {Vector2} coordinate
   * @param {number} levelOfDetail
   * */
  async AppendChunkAsync(coordinate, levelOfDetail) {
    const chunk = await this.GetChunkBuilderAsync(
      coordinate,
      this.debugProp.chunkSize,
      levelOfDetail,
    );
    this.chunks.set(chunk.coordinate.Tokey(), chunk);
    this.rendered = false;
  }

  /**
   * @param {Function} addToApp
   * */
  async RenderChunks(addToApp) {
    if (this.rendered) return;
    this.chunks.forEach((chunk) => {
      chunk.Create(this.blocks);
      chunk.meshes.forEach((mesh) => {
        addToApp(mesh);
      });
    });
    this.rendered = true;
  }

  /**
   * @param {Chunk} chunk
   * @param {Function} removeFromApp
   * */
  DisposeChunk(chunk, removeFromApp) {
    chunk.Dispose();
    chunk.meshes.forEach((mesh) => {
      removeFromApp(mesh);
    });

    this.chunks.delete(chunk.coordinate.Tokey());
  }
}
