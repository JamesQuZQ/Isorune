import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
export class GeoContainer {
  constructor() {
    this.container = new THREE.BoxGeometry(0, 0, 0);
  }

  Merge(geo) {
    this.container = mergeGeometries([this.container, geo]);
    return this;
  }

  Build() {
    return new THREE.Mesh(
      this.container,
      new THREE.MeshBasicMaterial({ color: 0xfff000 }),
    );
  }
}
