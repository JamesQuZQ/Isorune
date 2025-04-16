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
  SNOW: 5,
};

export default class Voxel {
  #type;

  /**
   * @param {number} size
   * @param {VoxelType} type
   * */
  constructor(size, type) {
    const half = size * 0.5;
    this.#type = type;

    const geoLeft = new PlaneGeometry(size, size, 1, 1);
    geoLeft.rotateY(Math.PI / 2);
    geoLeft.translate(size, half, half);
    geoLeft.computeVertexNormals();
    // geoLeft.attributes.position.needsUpdate = true;
    this.left = geoLeft;

    const geoRight = new PlaneGeometry(size, size, 1, 1);
    geoRight.rotateY(-Math.PI / 2);
    geoRight.translate(0, half, half);
    geoRight.computeVertexNormals();
    // geoRight.attributes.position.needsUpdate = true;
    this.right = geoRight;

    const geoTop = new PlaneGeometry(size, size, 1, 1);
    geoTop.rotateX(-Math.PI / 2);
    geoTop.translate(half, size, half);
    geoTop.computeVertexNormals();
    // geoTop.attributes.position.needsUpdate = true;
    this.top = geoTop;

    const geoBack = new PlaneGeometry(size, size, 1, 1);
    geoBack.translate(half, half, size);
    geoBack.computeVertexNormals();
    //geoBack.attributes.position.needsUpdate = true;
    this.back = geoBack;

    const geoFront = new PlaneGeometry(size, size, 1, 1);
    geoFront.translate(half, half, 0);
    geoFront.computeVertexNormals();
    //geoFront.attributes.position.needsUpdate = true;
    this.front = geoFront;
  }

  SetUVCoordinate(geometries, uvArray) {
    for (const geometry of geometries) {
      if (this[geometry]) {
        Voxel.SetUV(this[geometry], uvArray);
      }
    }
  }

  /**
   * @param {BufferGeometry} geometry
   * @param {Float32Array} uvArray
   * */
  static SetUV(geometry, uvArray) {
    geometry.setAttribute('uv', new BufferAttribute(uvArray, 2));
    geometry.attributes.uv.needsUpdate = true;
  }
}
