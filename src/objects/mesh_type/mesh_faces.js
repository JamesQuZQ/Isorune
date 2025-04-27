import { DynamicDrawUsage, InstancedMesh, Material, Matrix4 } from 'three';
import Voxel, { VoxelType, VoxelFace } from '@/objects/voxel';
import { Terrain } from '../terrain/terrain';

export default class MeshFaces {
  constructor() {
    this.meshFacesInstace = new Array(5);
    this.ndx = new Array(5).fill(0);
  }

  /**
   * @param {VoxelFace} face
   * @param {number} size
   * @param {Material} mat
   * @param {number} count
   * @param {Voxel} voxel
   *
   * @returns {InstancedMesh}
   * */
  GetMeshFace(face, size, mat, count, voxel) {
    if (this.meshFacesInstace[face]) {
      return this.meshFacesInstace[face];
    }

    const mesh = new InstancedMesh(voxel.GetFace(face, size), mat, count);

    return (this.meshFacesInstace[face] = mesh);
  }

  UpdateMesh(pos, face, mesh) {
    mesh.setMatrixAt(this.ndx[face]++, pos);

    this.UpdateInstanceCount(face);

    this.UdpateMatrix(face);
  }

  /**
   * @param {Vector3} coordinate
   * @param {Map} blocks
   * @param {number} size
   * @param {*} edge
   * @param {VoxelFace} voxelFace
   * @param {*} material
   * @param {Matrix4} pos
   * */
  async BuildMeshFacesAsync(
    coordinate,
    blocks,
    size,
    edge,
    voxelFace,
    material,
    pos,
  ) {
    const x = coordinate.x;
    const y = coordinate.y;
    const z = coordinate.z;

    const PlaceTopMeshFace = async (key, face) => {
      const nextVoxelExisted = blocks.has(key);
      const count = Terrain.TERRAIN_CHUNk_LIMIT * Terrain.TERRAIN_CHUNk_LIMIT;
      if (nextVoxelExisted) {
        return;
      }

      pos.makeTranslation(x, z, y);

      const mesh = this.GetMeshFace(face, size, material, count, voxelFace);

      this.UpdateMesh(pos, face, mesh);
    };

    const PlaceMeshFace = async (key, face, isAtEdge = false) => {
      const nextVoxelExisted = blocks.has(key);
      const count = Terrain.TERRAIN_CHUNk_HEIGHT * Terrain.TERRAIN_CHUNk_LIMIT;
      if (nextVoxelExisted) {
        return;
      }

      /*
       * Generate face without next voxel existed OR
       * Generate face if next voxel is Water OR
       * Generate face if the face is not at the edge of chunk
       * */
      const isWater = () => {
        return isAtEdge ? false : blocks.get(key).type == VoxelType.WATER;
      };

      if ((!nextVoxelExisted && !isAtEdge) || isWater()) {
        pos.makeTranslation(x, z, y);

        const mesh = this.GetMeshFace(face, size, material, count, voxelFace);
        this.UpdateMesh(pos, face, mesh);
      }
    };

    const IsAtEdge = (edge, chunkEdge) => {
      return edge == chunkEdge;
    };

    const nextX = x + size;
    await PlaceMeshFace(
      `${nextX},${z},${y}`,
      VoxelFace.RIGHT,
      IsAtEdge(nextX, edge.maxEdge.x),
      (Terrain.TERRAIN_CHUNk_LIMIT * Terrain.TERRAIN_CHUNk_HEIGHT * 3) / 4,
    );

    const prevX = x - size;
    await PlaceMeshFace(
      `${prevX},${z},${y}`,
      VoxelFace.LEFT,
      IsAtEdge(x, edge.minEdge.x),
      (Terrain.TERRAIN_CHUNk_LIMIT * Terrain.TERRAIN_CHUNk_HEIGHT * 3) / 4,
    );

    const nextZ = z + size;
    await PlaceTopMeshFace(
      `${x},${nextZ},${y}`,
      VoxelFace.TOP,
      Terrain.TERRAIN_CHUNk_LIMIT * Terrain.TERRAIN_CHUNk_LIMIT,
    );

    const nextY = y + size;
    await PlaceMeshFace(
      `${x},${z},${nextY}`,
      VoxelFace.FRONT,
      IsAtEdge(nextY, edge.maxEdge.y),
      Terrain.TERRAIN_CHUNk_LIMIT * Terrain.TERRAIN_CHUNk_HEIGHT,
    );

    const prevY = y - size;
    await PlaceMeshFace(
      `${x},${z},${prevY}`,
      VoxelFace.BACk,
      IsAtEdge(y, edge.minEdge.y),
      Terrain.TERRAIN_CHUNk_LIMIT * Terrain.TERRAIN_CHUNk_HEIGHT,
    );
  }

  UpdateInstanceCount(meshFace) {
    this.meshFacesInstace[meshFace].count = this.ndx[meshFace];
  }

  UdpateMatrix(meshFace) {
    /** @type {InstancedMesh}*/
    const faceMesh = this.meshFacesInstace[meshFace];
    faceMesh.instanceMatrix.needsUpdate = true;
    faceMesh.instanceMatrix.setUsage(DynamicDrawUsage);
    faceMesh.computeBoundingBox();
    faceMesh.computeBoundingSphere();
  }

  HideAll() {
    for (const meshFace of Object.values(VoxelFace)) {
      this.meshFacesInstace[meshFace].visible = false;
    }
  }

  Hide(meshFace) {
    this.meshFacesInstace[meshFace].visible = false;
  }

  ShowAll() {
    for (const meshFace of Object.values(VoxelFace)) {
      this.meshFacesInstace[meshFace].visible = true;
    }
  }

  Show(meshFace) {
    this.meshFacesInstace[meshFace].visible = true;
  }
}
