import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { App } from '@/core/app';
/** @import * as THREE from 'three'*/

/**
 * @class
 * @public
 * @property {BoxGeometry} mesh
 * */
export class Character {
  /**
   * @param {THREE.Vector2} position
   * */
  constructor(position) {
    const geo = new BoxGeometry(1, 1, 1);
    geo.translate(position.x, position.y, 1 * 0.5);
    const mat = new MeshBasicMaterial({ color: 0xfff000 });
    const mesh = new Mesh(geo, mat);
    this.mesh = mesh;

    this.keyMap = {};

    const onDocumentKey = (e) => {
      this.keyMap[e.code] = e.type === 'keydown';
    };

    document.addEventListener('keydown', onDocumentKey, false);
    document.addEventListener('keyup', onDocumentKey, false);
  }

  Tick(delta) {
    if (this.keyMap['KeyW'] || this.keyMap['ArrowUp']) {
      this.mesh.translateY(delta * 25);
    }

    if (this.keyMap['KeyS'] || this.keyMap['ArrowDown']) {
      this.mesh.translateY(-delta * 25);
    }

    if (this.keyMap['KeyA'] || this.keyMap['ArrowLeft']) {
      this.mesh.translateX(-delta * 25);
    }

    if (this.keyMap['KeyD'] || this.keyMap['ArrowRight']) {
      this.mesh.translateX(delta * 25);
    }
  }
}
