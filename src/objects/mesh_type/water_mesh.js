import MeshFaces from '@/objects/mesh_type/mesh_faces';

export default class WaterMesh extends MeshFaces {
  constructor(voxel, count, material) {
    super(voxel, count, material);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {Map} blocks
   * @param {number} size
   * @param {Matrix4} pos
   * */
  BuildMeshFaces(x, y, z, blocks, size, pos) {
    const PlaceMeshFace = (key, geometry, direction) => {
      if (!blocks.has(key)) {
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
}
