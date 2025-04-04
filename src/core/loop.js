import { Clock } from 'three';
import { App } from '@/core/app';

/** @import {Camera, Scene, WebGLRenderer} from 'three'*/
/** @import Stats from 'three/examples/jsm/libs/stats.module';*/

/**
 * @property {WebGLRenderer} renderer
 * @property {Scene} scene
 * @property {Camera} camera
 * @property {Stats} stats
 * */
export class Loop {
  #updateables;
  #postRenderProcesses;
  #preRenderProcesses;

  constructor() {
    const app = new App();
    this.camera = app.camera;
    this.scene = app.scene;
    this.renderer = app.renderer;
    this.stats = app.config.stats;
    this.clock = new Clock();

    this.#updateables = [];
    this.#postRenderProcesses = [];
    this.#preRenderProcesses = [];
  }

  /**
   * @param {Function} render
   * */
  Start() {
    this.renderer.setAnimationLoop(async () => {
      this.Tick();
      this.PreRender();
      this.renderer.render(this.scene, this.camera);
      this.PostRender();
    });
  }

  Stop() {
    this.renderer.setAnimationLoop(null);
  }

  Tick() {
    if (!this.#updateables) return;

    const delta = this.clock.getDelta();

    this.#updateables.forEach((o) => {
      if (o.Tick) o.Tick(delta);
    });
  }

  PreRender() {}

  PostRender() {
    this.stats.update();
    //console.log(this.renderer.info.render.calls);
    this.renderer.info.reset();
  }

  Add(object) {
    if (!object.Tick) return;
    this.#updateables.push(object);
  }

  /** TODO: remove object in updateables after event
   * @param {Object} object_index - the object to remove from updateables
   */
  Remove(object_index) {}
}
