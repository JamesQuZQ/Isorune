import { InstancedMesh, MeshLambertMaterial } from 'three';
import { VoxelType } from '@/objects/voxel';

export default class MeshFaces {
  /**
   * @param {Voxel} voxel
   * @param {number} count
   * @param {MeshLambertMaterial} material
   * */
  constructor(voxel, count, material) {
    const mat = material;
    this.front = new InstancedMesh(voxel.front, mat, count);
    this.top = new InstancedMesh(voxel.top, mat, count);
    this.back = new InstancedMesh(voxel.back, mat, count);
    this.right = new InstancedMesh(voxel.right, mat, count);
    this.left = new InstancedMesh(voxel.left, mat, count);
    this.ndx = {
      front: 0,
      top: 0,
      back: 0,
      left: 0,
      right: 0,
    };
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {Map} blocks
   * @param {number} size
   * @param {Matrix4} pos
   * @param {*} edge
   * */
  BuildMeshFaces(x, y, z, blocks, size, pos, edge) {
    const PlaceMeshFace = (key, geometry, direction) => {
      if (!blocks.has(key) || blocks.get(key).type == VoxelType.WATER) {
        pos.makeTranslation(x, z, y);
        geometry.setMatrixAt(this.ndx[direction]++, pos);
      }
    };

    PlaceMeshFace(`${x + size},${z},${y}`, this.left, 'left');
    PlaceMeshFace(`${x - size},${z},${y}`, this.right, 'right');
    PlaceMeshFace(`${x},${z + size},${y}`, this.top, 'top');
    PlaceMeshFace(`${x},${z},${y + size}`, this.back, 'back');
    PlaceMeshFace(`${x},${z},${y - size}`, this.front, 'front');

    this.front.count = this.ndx.front;
    this.top.count = this.ndx.top;
    this.back.count = this.ndx.back;
    this.right.count = this.ndx.right;
    this.left.count = this.ndx.left;

    this.UdpateMatrix();
  }

  UdpateMatrix() {
    this.front.instanceMatrix.needsUpdate = true;
    this.top.instanceMatrix.needsUpdate = true;
    this.back.instanceMatrix.needsUpdate = true;
    this.right.instanceMatrix.needsUpdate = true;
    this.left.instanceMatrix.needsUpdate = true;
  }

  Hide() {
    this.HideLeft();
    this.HideTop();
    this.HideBack();
    this.HideFront();
    this.HideRight();
  }

  HideTop() {
    this.top.visible = false;
  }

  HideFront() {
    this.front.visible = false;
  }

  HideBack() {
    this.back.visible = false;
  }

  HideLeft() {
    this.left.visible = false;
  }

  HideRight() {
    this.right.visible = false;
  }

  Show() {
    this.ShowLeft();
    this.ShowTop();
    this.ShowBack();
    this.ShowFront();
    this.ShowRight();
  }

  ShowTop() {
    this.top.visible = true;
  }

  ShowFront() {
    this.front.visible = true;
  }

  ShowBack() {
    this.back.visible = true;
  }

  ShowLeft() {
    this.left.visible = true;
  }

  ShowRight() {
    this.right.visible = true;
  }
}
