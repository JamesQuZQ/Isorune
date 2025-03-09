import { Clock } from "three";

export class Loop {
  #updateables;
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
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
}
