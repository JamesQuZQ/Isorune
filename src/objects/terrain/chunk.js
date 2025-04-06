import {
  BoxGeometry,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector2,
  Vector3,
} from 'three';
import { BlockTypeContainer } from '@/objects/terrain/container';
import Voxel from './voxel';

/** @import { Noise } from '@/logics/noise'*/
/** @import Terrain from '@/objects/terrain/terrain'*/
/** @import { Vector2 } from 'three'*/

/**
 * @property {GeoContainer[]} blockTypes
 * @property {Vector2} edge
 * @property {number} size
 * @property {Group} group
 *
 * */
export class Chunk {
  static SNOW_HEIGHT = 40;
  static MOUNTANTROCk_HEIGHT = 27;
  static STONE_HEIGHT = 10;
  static GRASS_HEIGHT = 3;
  static SAND_HEIGHT = 0.4;
  static SOIL_HEIGHT = 0;
  static RIVER_HEIGHT = 0.2;

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
  }

  /**
   * @param {Noise} noise - The Noise seed
   * @param {NoiseConfig} noiseProps
   * @param {Map} blocks
   * */
  async GenerateAsync(noise, noiseProps, blocks) {
    for (let y = this.edge.minEdge.y; y < this.edge.maxEdge.y; y += this.LOD) {
      for (
        let x = this.edge.minEdge.x;
        x < this.edge.maxEdge.x;
        x += this.LOD
      ) {
        const blockHeight = Math.floor(
          noise.Get2D(x, y, noiseProps) * this.height,
        );
        // const blockHeight = this.size;
        for (let z = 0; z <= blockHeight; z += this.LOD) {
          blocks.set(`${x},${z},${y}`);
        }
      }
    }

    return this;
  }

  Create(blocks) {
    const size = this.LOD;
    const half = size * 0.5;

    const voxel = new Voxel(size, half);

    const mat = new MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
    });

    const matest = new MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
    });
    const count = blocks.size;

    const top = new InstancedMesh(voxel.top, mat, count);
    const bottom = new InstancedMesh(voxel.bottom, mat, count);
    const front = new InstancedMesh(voxel.front, mat, count);
    const right = new InstancedMesh(voxel.right, mat, count);
    const left = new InstancedMesh(voxel.left, mat, count);

    const pos = new Matrix4();

    let ndxFront = 0,
      ndxTop = 0,
      ndxBottom = 0,
      ndxLeft = 0,
      ndxRight = 0;

    for (let y = this.edge.minEdge.y; y < this.edge.maxEdge.y; y += size) {
      for (let x = this.edge.minEdge.x; x < this.edge.maxEdge.x; x += size) {
        for (let z = 0; z <= this.height; z += size) {
          const key = `${x},${z},${y}`;
          if (!blocks.has(key)) continue;

          const cx = x;
          const cy = z;
          const cz = y;

          if (!blocks.has(`${x + size},${z},${y}`)) {
            pos.makeTranslation(cx, cy, cz);
            left.setMatrixAt(ndxRight++, pos);
          }

          if (!blocks.has(`${x - size},${z},${y}`)) {
            pos.makeTranslation(cx, cy, cz);
            right.setMatrixAt(ndxLeft++, pos);
          }

          if (!blocks.has(`${x},${z + size},${y}`)) {
            pos.makeTranslation(cx, cy, cz);
            front.setMatrixAt(ndxTop++, pos);
          }

          if (!blocks.has(`${x},${z},${y + size}`)) {
            pos.makeTranslation(cx, cy, cz);
            top.setMatrixAt(ndxFront++, pos);
          }

          if (!blocks.has(`${x},${z},${y - size}`)) {
            pos.makeTranslation(cx, cy, cz);
            bottom.setMatrixAt(ndxBottom++, pos);
          }
        }
      }
    }

    top.count = ndxFront;
    front.count = ndxTop;
    bottom.count = ndxBottom;
    right.count = ndxLeft;
    left.count = ndxRight;

    top.instanceMatrix.needsUpdate = true;
    bottom.instanceMatrix.needsUpdate = true;
    front.instanceMatrix.needsUpdate = true;
    right.instanceMatrix.needsUpdate = true;
    left.instanceMatrix.needsUpdate = true;

    this.meshes = [top, bottom, front, right, left];
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
