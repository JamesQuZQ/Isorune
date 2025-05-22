import { Chunk } from "@/objects/terrain";
import { Noise } from "@/logics/noise";
import Biome from "@/objects/biome";
import { BlockType } from "@/objects/blocks";

import { MeshLambertMaterial, DoubleSide } from "three";

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
    octaves: 8,
    scale: 800,
    persistant: 100,
    exponentiation: 3,
    lacunarity: 150,
  };

  static TERRAIN_CHUNk_LIMIT = 160;
  static TERRAIN_CHUNk_HEIGHT = 400;
  static SEA_LEVEL = 1;
  static DEFAULT_LOD = 4;

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
      wireframe: false,
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
    const size = chunk.LOD;

    const edge = chunk.edge;
    const minX = edge.minEdge.x - size;
    const maxX = edge.maxEdge.x + size;
    const minY = edge.minEdge.y - size;
    const maxY = edge.maxEdge.y + size;

    /**
     * @param {string} key
     * @param {BlockType} voxelType
     * */
    const updateTerrainInfo = (key, voxelType) => {
      this.#blocks.set(key, { type: voxelType });
    };

    for (let y = minY; y <= maxY; y += size) {
      for (let x = minX; x <= maxX; x += size) {
        const blockHeight = Math.floor(
          this.heightNoise.Get2D(x, y, this.noiseConfig) *
            Terrain.TERRAIN_CHUNk_HEIGHT
        );

        // const blockHeight = 1;

        for (let z = 0; z <= blockHeight; z += size) {
          const key = `${x},${z},${y}`;
          if (this.#blocks.has(key)) continue;

          if (z < 2 * size) {
            updateTerrainInfo(key, BlockType.SOIL);
          } else if (z < 3 * size) {
            updateTerrainInfo(key, BlockType.SAND);
          } else if (z > 3) {
            updateTerrainInfo(key, BlockType.GRASS);
          }
        }

        // Water block generation code removed - spaces will remain empty
      }
    }
  }

  /**
   * @param {Vector2} coordinate
   * @param {number} levelOfDetail
   *
   * @returns {Promise<Chunk>}
   * */
  async AppendChunkAsync(coordinate, levelOfDetail = Terrain.DEFAULT_LOD) {
    const coordinatekey = coordinate.Tokey();
    if (this.#chunks.has(coordinatekey)) {
      return this.#chunks.get(coordinatekey);
    }

    const chunk = new Chunk(
      coordinate,
      Terrain.TERRAIN_CHUNk_LIMIT,
      levelOfDetail
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

    chunk.ToInstanceMesh().forEach((mesh) => {
      addToApp(mesh);
    });

    this.rendered = true;
  }

  DisposeChunk(chunk) {}

  /**
   * Get suitable positions for placing buildings on soil blocks
   * @param {number} levelOfDetail - The level of detail (block size)
   * @returns {Array<{position: Vector3, type: number}>} - Array of suitable block positions
   */
  getSoilBlocksForBuildings(levelOfDetail = this.DEFAULT_LOD) {
    const soilBlocks = [];
    const size = levelOfDetail;

    // Define a border margin to avoid placing buildings near terrain edges
    const borderMargin = 40; // Significant margin to stay away from borders

    console.log(`Searching for soil blocks with LOD size: ${size}`);
    console.log(`Total blocks in terrain: ${this.#blocks.size}`);

    // Find the terrain boundaries
    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;

    this.#blocks.forEach((blockInfo, key) => {
      const [x, unused, y] = key.split(",").map(Number);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });

    console.log(
      `Terrain boundaries: X(${minX} to ${maxX}), Z(${minY} to ${maxY})`
    );

    // Find soil blocks that have nothing above them but are surrounded by soil on sides
    // AND are not near the terrain borders
    this.#blocks.forEach((blockData, key) => {
      if (blockData.type === BlockType.SOIL) {
        const [x, z, y] = key.split(",").map(Number);

        // Skip blocks that are too close to the terrain borders
        if (
          x < minX + borderMargin ||
          x > maxX - borderMargin ||
          y < minY + borderMargin ||
          y > maxY - borderMargin
        ) {
          return; // Skip this block
        }

        // Check if this block has no block above it (exposed top)
        const blockAboveKey = `${x},${z + size},${y}`;
        const hasNoBlockAbove = !this.#blocks.has(blockAboveKey);

        if (hasNoBlockAbove) {
          // Check if this block has soil neighbors on all 4 sides
          const neighbors = [
            `${x + size},${z},${y}`, // east
            `${x - size},${z},${y}`, // west
            `${x},${z},${y + size}`, // north
            `${x},${z},${y - size}`, // south
          ];

          let soilNeighborCount = 0;
          for (const neighborKey of neighbors) {
            const neighborBlock = this.#blocks.get(neighborKey);
            if (neighborBlock && neighborBlock.type === BlockType.SOIL) {
              soilNeighborCount++;
            }
          }

          // Only add blocks that have at least 3 soil neighbors
          if (soilNeighborCount >= 3) {
            // This is a good soil block for building - it's at the surface, has soil around it, and is far from borders
            soilBlocks.push({
              position: { x, y: z, z: y }, // Correct order for Three.js coordinates
              type: blockData.type,
            });

            if (soilBlocks.length % 10 === 0) {
              console.log(
                `Found suitable soil block at: x=${x}, y=${z}, z=${y} (interior block with ${soilNeighborCount} soil neighbors)`
              );
            }
          }
        }
      }
    });

    console.log(
      `Found ${soilBlocks.length} suitable soil blocks (exposed top, surrounded sides, away from borders)`
    );

    return soilBlocks;
  }
}
