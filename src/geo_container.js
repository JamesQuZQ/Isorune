import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export class GeoContainer {
  constructor() {
    this.vector_helper = new THREE.Vector3();
    this.container = new THREE.BoxGeometry(0, 0, 0);
  }

  Merge(geo) {
    this.container = mergeGeometries([this.container, geo]);
    return this;
  }

  Build() {
    const mesh = new THREE.Mesh(
      this.container,
      new THREE.MeshBasicMaterial({ wireframe: true, color: 0x000000 }),
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.mesh = mesh;

    return this;
  }
}
