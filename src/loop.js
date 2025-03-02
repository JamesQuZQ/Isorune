import { Clock } from "three";

export class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updateables = [];
    this.clock = new Clock();
  }

  Start() {
    this.renderer.setAnimationLoop(() => {
      this.Tick();
      this.renderer.render(this.scene, this.camera);
    });
  }

  Stop() {
    this.renderer.setAnimationLoop(null);
  }

  Tick() {
    const delta = this.clock.getDelta();
    this.updateables.forEach((o) => {
      o.Tick(delta);
    });
  }

  Add(object) {
    this.updateables.push(object);
  }
}
