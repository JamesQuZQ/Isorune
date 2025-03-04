import { Clock } from "three";

export class Loop {
  #updateables;
  constructor(camera, scene, renderer, stats) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.stats = stats;
    this.#updateables = [];
    this.clock = new Clock();
  }

  Start() {
    this.renderer.setAnimationLoop(() => {
      this.Tick();
      this.stats.update();
      this.renderer.render(this.scene, this.camera);
    });
  }

  Stop() {
    this.renderer.setAnimationLoop(null);
  }

  Tick() {
    const delta = this.clock.getDelta();
    this.#updateables.forEach((o) => {
      if (o.Tick) o.Tick(delta);
    });
  }

  Add(object) {
    this.#updateables.push(object);
  }
}
