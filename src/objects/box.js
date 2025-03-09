import { BoxGeometry, Color, Mesh, MeshBasicMaterial } from "three";

export class Box {
  constructor() {}

  Create_Singular(color = 0xffff10, position) {
    this.geo = new BoxGeometry(1, 1, 1);
    this.mat = new MeshBasicMaterial({
      color: new Color(color),
    });
    this.mesh = new Mesh(this.geo, this.mat);

    return this;
  }

  CreateGeometry() {
    this.geo = new BoxGeometry(1, 1, 1);
    return this;
  }

  SetPos(position, height) {
    this.geo.scale(1, 1, height);
    this.geo.translate(position.x, position.y, height * 0.5);
  }
}
