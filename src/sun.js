import { Color, DirectionalLight } from "three";

export class Sun {
  constructor() {
    const light = new DirectionalLight(
      new Color("#FFCB8E").convertSRGBToLinear().convertSRGBToLinear(),
      2,
    );

    light.position.set(10, 20, 10);

    light.castShadow = false;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    this.light = light;
  }
}
