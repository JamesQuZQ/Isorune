import { Bootstrap } from "./bootstrap";
import { Loop } from "./loop";
import { Noise } from "./noise";
import { Sun } from "./sun";

export class App {
  #textures;
  constructor() {
    this.config = new Bootstrap();
    this.noise = new Noise().WithConfig(this.config.gui);
    this.loop = new Loop(
      this.config.camera,
      this.config.scene,
      this.config.renderer,
      this.config.stats,
    );
    this.sun = new Sun();
  }

  Start() {
    this.loop.Start();
  }

  Add(object) {
    this.loop.Add(object);
    this.config.scene.add(object.mesh);
  }

  async AddAsync(object) {
    this.loop.Add(object);
    this.config.scene.add(object.mesh);
  }

  Stop() {
    this.loop.Stop();
  }
}
