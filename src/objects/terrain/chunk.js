import { Matrix4, Vector2 } from 'three';
import Voxel, { VoxelType } from '@/objects/voxel';
import MeshFaces from '@/objects/mesh_type/mesh_faces';
import WaterMesh from '../mesh_type/water_mesh';
import texture from '@/game_config/texture';
import ThreeHelper from '@/utils/three_helper';

/**
 * @property {GeoContainer[]} blockTypes
 * @property {Vector2} edge
 * @property {number} size
 * @property {Group} group
 *
 * */
export class Chunk {
  /**
   * @param {Vector2} coordinate
   * @param {number} size
   * @param {number} levelOfDetail
   * @param {number} height
   * */
  constructor(coordinate, size, levelOfDetail, height) {
    this.coordinate = new Vector2().copy(coordinate);
    this.size = size;
    this.edge = {
      maxEdge: new Vector2(
        coordinate.x * size + size,
        coordinate.y * size + size,
      ),
      minEdge: new Vector2(coordinate.x * size, coordinate.y * size),
    };

    this.LOD = levelOfDetail;
    this.height = height;
    this.containsVoxelType = new Set();
    this.meshFaces = new Array(36);
  }

  InitMeshFaces(count, voxelSize, material) {
    const { tileSize, atlasWidth, atlasHeight, grass, water, dirt } = texture;
    const grass_voxel = new Voxel(voxelSize, VoxelType.GRASS);
    grass_voxel.SetUVCoordinate(
      ['top'],
      ThreeHelper.GetUVFromSubTexture(
        grass.top,
        tileSize,
        atlasWidth,
        atlasHeight,
      ),
    );

    grass_voxel.SetUVCoordinate(
      ['back', 'front', 'right', 'left'],
      ThreeHelper.GetUVFromSubTexture(
        grass.side,
        tileSize,
        atlasWidth,
        atlasHeight,
      ),
    );
    const water_voxel = new Voxel(voxelSize, VoxelType.WATER);

    water_voxel.SetUVCoordinate(
      ['top', 'back', 'front', 'right', 'left'],
      ThreeHelper.GetUVFromSubTexture(water, tileSize, atlasWidth, atlasHeight),
    );

    const dirt_voxel = new Voxel(voxelSize, VoxelType.SOIL);

    dirt_voxel.SetUVCoordinate(
      ['top', 'back', 'front', 'right', 'left'],
      ThreeHelper.GetUVFromSubTexture(dirt, tileSize, atlasWidth, atlasHeight),
    );

    if (this.containsVoxelType.has(VoxelType.GRASS)) {
      this.meshFaces[VoxelType.GRASS] = new MeshFaces(
        grass_voxel,
        count,
        material,
      );
    }

    if (this.containsVoxelType.has(VoxelType.WATER)) {
      this.meshFaces[VoxelType.WATER] = new WaterMesh(
        water_voxel,
        count,
        material,
      );
    }

    if (this.containsVoxelType.has(VoxelType.SOIL)) {
      this.meshFaces[VoxelType.SOIL] = new MeshFaces(
        dirt_voxel,
        count,
        material,
      );
    }
  }

  /**
   * @param {*} blocks
   * @param {*} material
   * @param {*} pos
   * */
  Create(blocks, material, pos) {
    const voxelSize = this.LOD;

    const buildMeshFaces = (x, y, z, voxelType) => {};

    this.InitMeshFaces(blocks.size, voxelSize, material);

    //NOTE: We don't have to render the faces that is at the edge of the chunk

    for (let y = this.edge.minEdge.y; y < this.edge.maxEdge.y; y += voxelSize) {
      for (
        let x = this.edge.minEdge.x;
        x < this.edge.maxEdge.x;
        x += voxelSize
      ) {
        for (let z = 0; z <= this.height; z += voxelSize) {
          const key = `${x},${z},${y}`;
          if (!blocks.has(key)) continue;
          this.meshFaces[blocks.get(key).type].BuildMeshFaces(
            x,
            y,
            z,
            blocks,
            voxelSize,
            pos,
          );
        }
      }
    }

    this.meshFaces = this.meshFaces.filter((x) => x != null);
    this.meshes = this.meshFaces.flatMap((mf) => [
      mf.front,
      mf.top,
      mf.back,
      mf.right,
      mf.left,
    ]);
  }

  /**
   * @param {Vector2} characterPosition2D
   *
   * @returns {boolean}
   * */
  IsInBounding(characterPosition2D) {
    return this.maxEdge.distanceTo(characterPosition2D) <= this.size;
  }

  Dispose() {
    this.meshes.forEach((mesh) => {
      mesh.material.dispose();
      mesh.geometry.dispose();
      mesh.dispose();
    });
  }

  Hide() {
    this.meshes.forEach((mesh) => {
      mesh.visible = false;
    });
  }

  Show() {
    this.meshes.forEach((mesh) => {
      mesh.visible = true;
    });
  }
}
