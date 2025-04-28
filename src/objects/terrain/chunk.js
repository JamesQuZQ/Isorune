import { Matrix4, Vector2, Vector3 } from 'three';
import MeshFaces from '@/objects/mesh_type/mesh_faces';
import { Terrain } from './terrain';
import Biome from '../biome';

/**
 * @property {GeoContainer[]} blockTypes
 * @property {Vector2} edge
 * @property {number} size
 * @property {Group} group
 * @property {Array.<MeshFaces>} meshFaces
 *
 * */
export class Chunk {
  /**
   * @param {Vector2} coordinate
   * @param {number} size
   * @param {number} levelOfDetail
   * */
  constructor(coordinate, size, levelOfDetail) {
    this.coordinate = new Vector2().copy(coordinate);
    this.size = size;
    this.edge = {
      maxEdge: new Vector2(
        coordinate.x * this.size + this.size,
        coordinate.y * this.size + this.size,
      ),
      minEdge: new Vector2(coordinate.x * this.size, coordinate.y * this.size),
    };

    this.LOD = levelOfDetail;

    /** @type {Array<MeshFaces>}*/
    this.meshFaces = new Array(10);

    this.vector3Buffer = new Vector3();
    this.matrix4Buffer = new Matrix4();
  }

  /**
   * @param {*} blocks
   * @param {*} material
   * @param {Biome} biome
   * */
  async CreateAsync(blocks, material, biome) {
    const workerData = {
      chunk: this,
      blocks: blocks,
      biome: biome,
      material: material,
      buffer: this.matrix4Buffer,
    };

    const voxelSize = this.LOD;
    //NOTE: We don't have to render the faces that is at the edge of the chunk

    const minX = this.edge.minEdge.x;
    const maxX = this.edge.maxEdge.x;
    const minY = this.edge.minEdge.y;
    const maxY = this.edge.maxEdge.y;
    const minZ = 0;
    const maxZ = Terrain.TERRAIN_CHUNk_HEIGHT;

    // NOTE: The loop order (y, x, z) might seem unusual but corresponds to:
    // y: World Y coordinate (horizontal depth)
    // x: World X coordinate (horizontal width)
    // z: World Z coordinate (vertical height)
    for (let y = minY; y < maxY; y += voxelSize) {
      for (let x = minX; x < maxX; x += voxelSize) {
        for (let z = minZ; z <= maxZ; z += voxelSize) {
          const key = `${x},${z},${y}`;
          if (!blocks.has(key)) {
            continue;
          }

          const blockData = blocks.get(key);
          if (!blockData || typeof blockData.type === 'undefined') {
            console.warn(`Voxel data missing or invalid type at key: ${key}`);
            continue;
          }

          const blockType = blockData.type;

          /**@type {MeshFaces}*/
          const chunkFaces = this.meshFaces[blockType];

          try {
            await chunkFaces.BuildMeshFacesAsync(
              this.vector3Buffer.set(x, y, z),
              blocks,
              voxelSize,
              this.edge,
              biome.GetVoxel(blockType),
              material,
              this.matrix4Buffer,
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    this.meshFaces = this.meshFaces.filter((x) => x != null);
    this.meshes = this.meshFaces.flatMap(
      (/** @type {MeshFaces}*/ mf) => mf.meshFacesInstace,
    );
  }
}
