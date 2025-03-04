import * as THREE from "three";

export class Box {
  constructor(color = 0xffff10, position) {
    this.color = new THREE.Color(color);
    this.position = position;
  }

  Create_Singular() {
    this.geo = new THREE.BoxGeometry(1, 1, 1);
    this.geo.translate(this.position.x, this.position.y, this.position.z * 0.5);
    this.mat = new THREE.MeshBasicMaterial({
      color: this.color,
    });

    this.mesh = new THREE.Mesh(this.geo, this.mat);

    return this;
  }

  Create_Multiple() {
    const geo = new THREE.BoxGeometry(1, 1, this.position.z);
    geo.translate(this.position.x, this.position.y, this.position.z * 0.5);
    return geo;
  }
}
