import { BoxGeometry, Mesh, MeshPhysicalMaterial, Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export class BlockTypeContainer {
  constructor(texture) {
    this.texture = texture;
    this.vector_helper = new Vector3();
    this.container = new BoxGeometry(0, 0, 0);
  }

  Merge(geo) {
    if (!geo) return this;
    this.container = mergeGeometries([this.container, geo], false);
    return this;
  }

  async BuildAsync() {
    const mat = new MeshPhysicalMaterial({
      map: this.texture,
      wireframe: true,
    });

    const mesh = new Mesh(this.container, mat);
    mat.dispose();
    this.mesh = mesh;

    return this;
  }
}
