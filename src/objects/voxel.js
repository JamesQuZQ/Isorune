import { BufferAttribute, PlaneGeometry } from 'three';

/**@namespace Voxel*/

/**
 * Enum for Voxel Type
 * @readonly
 * @memberof Voxel
 * @enum {number}
 */
export const VoxelType = {
  WATER: 0,
  SAND: 1,
  SOIL: 2,
  GRASS: 3,
  ROCk: 4,
  SNOW_ROCk: 5,
  SNOW_DIRT: 6,
};

export const VoxelFace = {
  TOP: 0,
  FRONT: 1,
  BACk: 2,
  LEFT: 3,
  RIGHT: 4,
};

export default class Voxel {
  #type;
  /**
   * @param {VoxelType} type
   * */
  constructor(type) {
    this.#type = type;
    this.faces = new Array(5);
    const size = 1;

    this.size = size;

    const right = new PlaneGeometry(size, size);
    right.rotateY(Math.PI / 2);
    this.faces[VoxelFace.RIGHT] = right;

    const left = new PlaneGeometry(size, size);
    left.rotateY(-Math.PI / 2);
    this.faces[VoxelFace.LEFT] = left;

    const top = new PlaneGeometry(size, size);
    top.rotateX(-Math.PI / 2);
    this.faces[VoxelFace.TOP] = top;

    const front = new PlaneGeometry(size, size);
    this.faces[VoxelFace.FRONT] = front;

    const back = new PlaneGeometry(size, size);
    this.faces[VoxelFace.BACk] = back;
  }

  GetFace(voxelType, size = 1) {
    const half = size * 0.5;
    const face = this.faces[voxelType];

    if (size != this.size) {
      face.scale(size, size, size);
    }

    if (voxelType == VoxelFace.RIGHT) {
      face.translate(size, half, half);
    } else if (voxelType == VoxelFace.LEFT) {
      face.translate(0, half, half);
    } else if (voxelType == VoxelFace.TOP) {
      face.translate(half, size, half);
    } else if (voxelType == VoxelFace.FRONT) {
      face.translate(half, half, size);
    } else if (voxelType == VoxelFace.BACk) {
      face.translate(half, half, 0);
    }

    face.computeVertexNormals();
    return face;
  }

  /**
   * @param {VoxelFace} face
   * @param {Float32Array} uvAttribute
   * */
  SetUVCoordinate(face, uvAttribute) {
    if (this.faces[face] != null) {
      Voxel.SetUV(this.faces[face], uvAttribute);
    }
  }

  /**
   * @param {Float32Array} uvAttribute
   * @param {Array} excludes
   * */
  SetAllFacesUVCoordinate(uvAttribute, excludes = []) {
    for (const face of Object.values(VoxelFace)) {
      if (!excludes.includes(face)) {
        this.SetUVCoordinate(face, uvAttribute);
      }
    }
  }

  /**
   * @param {BufferGeometry} geometry
   * @param {Float32Array} uvAttribute
   * */
  static SetUV(geometry, uvAttribute) {
    geometry.computeVertexNormals();
    geometry.attributes.uv.set(uvAttribute);
    geometry.attributes.uv.needsUpdate = true;
  }
}
