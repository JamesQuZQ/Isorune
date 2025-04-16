import { Chunk } from '@/objects/terrain/chunk';
import Voxel, { VoxelType } from '@/objects/voxel';
import { Noise } from '@/logics/noise';
import { Vector2, Vector3 } from '@/utils/vector_helper';
import { MeshLambertMaterial, DoubleSide, Matrix4 } from 'three';

/**
 * @namespace Terrain
 */

/** @import { Debugger } from '@/tools/debugger'*/
/** @import { Texture , Vector3 } from 'three'*/
/** @import { BlockTypeContainer } from '@/objects/terrain/container'*/

/**
 * @property {Map} #blocks
 * @property {Noise} heightNoise
 * @property {Map} chunks
 * @property {boolean} rendered
 * */
export class Terrain {
  #blocks = new Map();
  rendered = false;
  heightNoise;
  material;
  chunks = new Map();
  matrixPool = new Matrix4();

  /** @type {import('@/logics/noise').NoiseProps} noiseConfig*/
  noiseConfig = {
    octaves: 7,
    scale: 450,
    persistant: 2,
    exponentiation: 7.5,
    lacunarity: 3,
  };

  debugProp = {
    LOD: 3, // Level Of Detail
    chunkSize: Terrain.TERRAIN_CHUNk_LIMIT,
    max_height: Terrain.TERRAIN_CHUNk_HEIGHT,
  };

  static TERRAIN_CHUNk_LIMIT = 100;
  static TERRAIN_CHUNk_HEIGHT = 100;
  static SEA_LEVEL = 3;
  get blocks() {
    return new Map(this.#blocks);
  }

  set blocks(new_blocks) {
    this.#blocks = new_blocks;
  }

  /**
   * @param {Debugger} gui
   * @param {Texture} texture
   * */
  constructor(gui, texture) {
    this.heightNoise = new Noise();

    this.material = new MeshLambertMaterial({
      map: texture,
      side: DoubleSide,
      alphaTest: 0.1,
      flatShading: true,
    });
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

  /**
   * @return {Map}
   * */
  InitVoxels() {
    const voxels = new Map();

    return voxels;
  }

  /**
   * @param {Chunk} chunk
   * */
  async GenerateAsync(chunk) {
    for (
      let y = chunk.edge.minEdge.y;
      y < chunk.edge.maxEdge.y;
      y += chunk.LOD
    ) {
      for (
        let x = chunk.edge.minEdge.x;
        x < chunk.edge.maxEdge.x;
        x += chunk.LOD
      ) {
        const blockHeight = Math.floor(
          this.heightNoise.Get2D(x, y, this.noiseConfig) *
            Terrain.TERRAIN_CHUNk_HEIGHT,
        );
        for (let z = 0; z <= blockHeight; z += chunk.LOD) {
          const key = `${x},${z},${y}`;
          if (this.#blocks.has(key)) continue;

          if (z < 3 * chunk.LOD) {
            this.#blocks.set(key, { type: VoxelType.SOIL });
            chunk.containsVoxelType.add(VoxelType.SOIL);
          } else {
            this.#blocks.set(key, { type: VoxelType.GRASS });
            chunk.containsVoxelType.add(VoxelType.GRASS);
          }

          if (blockHeight == 0) {
            for (
              let currLevel = chunk.LOD;
              z <= Terrain.SEA_LEVEL * chunk.LOD;
              z += chunk.LOD
            ) {
              const key = `${x},${currLevel},${y}`;
              this.#blocks.set(key, { type: VoxelType.WATER });
              chunk.containsVoxelType.add(VoxelType.WATER);
            }
          }
        }
      }
    }
  }

  /**
   * @param {Vector2} coordinate
   * @param {number} levelOfDetail
   * @param {*} texture
   * */
  async AppendChunkAsync(coordinate, levelOfDetail) {
    const chunk = new Chunk(
      coordinate,
      this.debugProp.chunkSize,
      levelOfDetail,
      this.debugProp.max_height,
    );

    await this.GenerateAsync(chunk);

    this.chunks.set(chunk.coordinate.Tokey(), chunk);
    this.rendered = false;
  }

  /**
   * @param {Function} addToApp
   * @param {Vector3} pos
   * */
  async RenderChunks(addToApp, pos) {
    if (this.rendered) return;
    this.chunks.forEach((/** @type {Chunk}*/ chunk) => {
      chunk.Create(this.blocks, this.material, this.matrixPool);
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
