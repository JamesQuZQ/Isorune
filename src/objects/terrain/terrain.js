import { Chunk } from '@/objects/terrain/chunk';
import { VoxelType } from '@/objects/voxel';
import { Noise } from '@/logics/noise';
import MeshFaces from '@/objects/mesh_type/mesh_faces';
import WaterMesh from '@/objects/mesh_type/water_mesh';
import { MeshLambertMaterial, DoubleSide } from 'three';
import Biome from '@/objects/biome';

/**
 * @namespace Terrain
 */

/** @import { Debugger } from '@/tools/debugger'*/
/** @import { Vector2 , Vector3 } from 'three'*/
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
  #chunks = new Map();

  /** @type {import('@/logics/noise').NoiseProps} noiseConfig*/
  noiseConfig = {
    octaves: 15,
    scale: 350,
    persistant: 10,
    exponentiation: 5,
    lacunarity: 100,
  };

  static TERRAIN_CHUNk_LIMIT = 150;
  static TERRAIN_CHUNk_HEIGHT = 250;
  static SEA_LEVEL = 2;
  static DEFAULT_LOD = 2;

  get blocks() {
    return new WeakMap(this.#blocks);
  }

  GetChunk(coordinate) {
    return this.#chunks.get(coordinate);
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

    this.biome = new Biome();
  }

  /**
   * @param {Chunk} chunk
   * */
  async GenerateAsync(chunk) {
    const updateTerrainInfo =
      /**
       * @param {VoxelType} voxelType
       * */
      (key, voxelType) => {
        this.#blocks.set(key, { type: voxelType, size: chunk.LOD });
        if (chunk.meshFaces[voxelType] != null) return;

        if (voxelType != VoxelType.WATER) {
          chunk.meshFaces[voxelType] = new MeshFaces();
        } else {
          chunk.meshFaces[voxelType] = new WaterMesh();
        }
      };

    const size = chunk.LOD;

    for (let y = chunk.edge.minEdge.y; y < chunk.edge.maxEdge.y; y += size) {
      for (let x = chunk.edge.minEdge.x; x < chunk.edge.maxEdge.x; x += size) {
        const blockHeight = Math.floor(
          this.heightNoise.Get2D(x, y, this.noiseConfig) *
            Terrain.TERRAIN_CHUNk_HEIGHT,
        );

        for (let z = 0; z <= blockHeight; z += size) {
          const key = `${x},${z},${y}`;
          if (this.#blocks.has(key)) continue;

          if (z < 2 * size) {
            updateTerrainInfo(key, VoxelType.SOIL);
          } else if (z < 3 * size) {
            updateTerrainInfo(key, VoxelType.SAND);
          } else {
            updateTerrainInfo(key, VoxelType.GRASS);
          }
        }

        /*
         * Create SEA
         * */
        if (blockHeight < 3 * size) {
          for (
            let currLevel = 1;
            currLevel <= Terrain.SEA_LEVEL - blockHeight;
            currLevel += size
          ) {
            const key = `${x},${currLevel},${y}`;
            if (this.#blocks.has(key)) continue;
            updateTerrainInfo(key, VoxelType.WATER);
          }
        }
      }
    }
  }

  /**
   * @param {Vector2} coordinate
   * @param {number} levelOfDetail
   *
   * @returns {Promise<Chunk>}
   * */
  async AppendChunkAsync(coordinate, levelOfDetail) {
    const coordinatekey = coordinate.Tokey();
    if (this.#chunks.has(coordinatekey)) return;

    const chunk = new Chunk(
      coordinate,
      Terrain.TERRAIN_CHUNk_LIMIT,
      levelOfDetail,
      this.biome,
    );

    await this.GenerateAsync(chunk);

    this.#chunks.set(coordinatekey, chunk);
    this.rendered = false;

    return chunk;
  }

  /**
   * @param {Chunk} chunk
   * @param {Function} addToApp
   * */
  async RenderChunks(chunk, addToApp) {
    if (this.rendered) return;

    await chunk.CreateAsync(this.#blocks, this.material, this.biome);
    chunk.meshes.forEach((mesh) => {
      addToApp(mesh);
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

    this.#chunks.delete(chunk.coordinate.Tokey());
  }
}
