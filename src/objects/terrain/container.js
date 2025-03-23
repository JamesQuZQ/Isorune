import { Mesh, MeshPhysicalMaterial, Vector3, BoxGeometry } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** @import { BoxGeometry , BufferGeometry} from 'three'*/

/**
 * @property {Mesh} mesh
 * @property {BoxGeometry} container
 * @property {Vector3} vector_helper
 * */
export class BlockTypeContainer {
  constructor(texture) {
    this.vector_helper = new Vector3();
    this.container = new BoxGeometry(0, 0, 0);
    this.mat = new MeshPhysicalMaterial({
      map: texture,
      wireframe: true,
    });
  }

  /**
   * @param {BufferGeometry} geo
   * @returns {BlockTypeContainer}
   * */
  Merge(geo) {
    if (!geo) return this;
    this.container = mergeGeometries([this.container, geo], false);
    return this;
  }

  /**
   * @returns {BlockTypeContainer}
   * */
  async BuildAsync() {
    const mesh = new Mesh(this.container, this.mat);
    this.mesh = mesh;

    return this;
  }
}
