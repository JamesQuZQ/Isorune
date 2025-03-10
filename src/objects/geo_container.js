import { BoxGeometry, Mesh, MeshPhysicalMaterial, Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export class GeoContainer {
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

  Build() {
    const mesh = new Mesh(
      this.container,
      new MeshPhysicalMaterial({
        map: this.texture,
      }),
    );

    // mesh.castShadow = true;
    // mesh.receiveShadow = true;
    this.mesh = mesh;

    return this;
  }

  async BuildAsync() {
    const mat = new MeshPhysicalMaterial({
      color: 0x000000,
      wireframe: true,
    });

    const mesh = new Mesh(this.container, mat);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.mesh = mesh;

    mat.dispose();
    return this;
  }
}
