import * as THREE from "three";

export class Box {
  constructor(color = 0xffff10, position) {
    this.color = new THREE.Color(color);
    this.position = position;

    this.Init();
  }

  Init() {
    this.Create_Singular();
  }

  Create_Singular() {
    this.geo = new THREE.BoxGeometry(1, 1, 1);
    this.geo.translate(this.position.x, this.position.y, this.position.z * 0.5);
    this.mat = new THREE.MeshBasicMaterial({
      color: this.color,
    });

    this.mesh = new THREE.Mesh(this.geo, this.mat);
  }

  Create_Multiple() {
    const geo = new THREE.BoxGeometry(1, 1, this.height);
    geo.translate(this.position.x, this.position.y, this.height * 0.5);
    return geo;
  }
}
