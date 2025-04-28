import { Matrix4, Vector2, Vector3 } from 'three';
import MeshFaces from '@/objects/mesh_type/mesh_faces';
import TransparentFaces from '@/objects/mesh_type/transparent_mesh';
import { Terrain } from '@/objects/terrain';
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
      buffer: this.matrix4Buffer,
    };

    const size = this.LOD;

    const edge = this.edge;
    const minX = edge.minEdge.x;
    const maxX = edge.maxEdge.x;
    const minY = edge.minEdge.y;
    const maxY = edge.maxEdge.y;

    const minZ = 0;
    const maxZ = Terrain.TERRAIN_CHUNk_HEIGHT;

    const _getOrCreateMeshFace = (blockType) => {
      let chunkFaces = this.meshFaces[blockType];
      if (chunkFaces) {
        return chunkFaces;
      }

      try {
        const voxelInfo = biome.GetVoxel(blockType);
        if (!voxelInfo) {
          console.warn(
            `No biome voxel info found for block type: ${blockType}`,
          );
        }

        if (voxelInfo.IsTransparent()) {
          chunkFaces = new TransparentFaces(material, voxelInfo);
          this.meshFaces[blockType] = chunkFaces;
        } else {
          chunkFaces = new MeshFaces(material, voxelInfo);
          this.meshFaces[blockType] = chunkFaces;
        }

        return chunkFaces;
      } catch (error) {
        console.error(error);
      }
    };

    for (let y = minY; y < maxY; y += size) {
      for (let x = minX; x < maxX; x += size) {
        for (let z = minZ; z <= maxZ; z += size) {
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
          const chunkFaces = _getOrCreateMeshFace(blockType);

          try {
            await chunkFaces.BuildMeshFacesAsync(
              this.vector3Buffer.set(x, y, z),
              blocks,
              this,
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    this.meshFaces = this.meshFaces.filter((x) => x != null);
    this.meshFaces.forEach((mesh) => {
      mesh.FinalizeMeshFace();
    });
    this.meshes = this.meshFaces.flatMap(
      (/** @type {MeshFaces}*/ mf) => mf.meshFacesInstace,
    );
  }
}
