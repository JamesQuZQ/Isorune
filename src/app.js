import { Loop } from "./loop";
import { Noise } from "./noise";

export class App {
  constructor(config) {
    this.config = config;
    this.noise = new Noise(config.gui);
    this.loop = new Loop(
      this.config.camera,
      this.config.scene,
      this.config.renderer,
    );
  }

  Start() {
    this.loop.Start();
  }

  Add(object) {
    this.loop.Add(object);
  }

  Stop() {
    this.loop.Stop();
  }
}
