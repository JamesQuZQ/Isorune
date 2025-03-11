import { Clock } from 'three';
import { App } from '@/core/app';

export class Loop {
  #updateables;
  constructor() {
    const app = new App();

    this.camera = app.camera;
    this.scene = app.scene;
    this.renderer = app.renderer;
    this.#updateables = [];
    this.clock = new Clock();
  }

  Start() {
    this.renderer.setAnimationLoop(() => {
      this.Tick();
      // this.stats.begin();
      this.renderer.render(this.scene, this.camera);
      // console.log(this.renderer.info.render.calls);
      // this.stats.end();
      this.renderer.info.reset();
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

  Add(object) {
    this.#updateables.push(object);
  }

  /** TODO: remove object in updateables after event
   * @param {Object} object_index - the object to remove from updateables
   */
  Remove(object_index) {}
}
