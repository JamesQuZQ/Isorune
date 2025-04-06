import { PlaneGeometry } from 'three';

export default class Voxel {
  constructor(size, half) {
    const geoLeft = new PlaneGeometry(size, size);
    geoLeft.rotateY(Math.PI / 2);
    geoLeft.translate(size, half, half);

    this.left = geoLeft;

    const geoRight = new PlaneGeometry(size, size);
    geoRight.rotateY(-Math.PI / 2);
    geoRight.translate(0, half, half);

    this.right = geoRight;

    const geoFront = new PlaneGeometry(size, size);
    geoFront.rotateX(-Math.PI / 2);
    geoFront.translate(half, size, half);

    this.front = geoFront;

    const geoTop = new PlaneGeometry(size, size);
    geoTop.translate(half, half, size);

    this.top = geoTop;

    const geoBottom = new PlaneGeometry(size, size);
    geoBottom.translate(half, half, 0);

    this.bottom = geoBottom;
  }
}
