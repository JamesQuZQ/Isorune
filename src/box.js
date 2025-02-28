import * as THREE from "three";

export class Box {
  constructor(app, color = 0xffff10) {
    this.color = new THREE.Color(color);
    this.Init(app);
  }

  Init(app) {
    this.Create();
    app.scene.add(this.mesh);
  }

  Create() {
    this.geo = new THREE.BoxGeometry(1, 1, 1);
    this.mat = new THREE.MeshBasicMaterial({
      color: this.color,
    });

    this.mesh = new THREE.Mesh(this.geo, this.mat);
  }

  RandomPlace(self) {
    const w = 10;
    this.mesh.position.setX(
      Math.round(Math.random()) * 2 - 1 * Math.floor(Math.random() * w),
    );
    this.mesh.position.setY(
      Math.round(Math.random()) * 2 - 1 * Math.floor(Math.random() * w),
    );
  }
}
