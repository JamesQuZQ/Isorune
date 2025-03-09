import { Bootstrap } from "@/bootstrap";
import { Loop } from "@/logics/loop";

export class App {
  #textures;
  constructor() {
    this.config = new Bootstrap();
    this.loop = new Loop(this.camera, this.scene, this.renderer);
  }

  get scene() {
    return this.config.scene;
  }

  get camera() {
    return this.config.camera;
  }

  get renderer() {
    return this.config.renderer;
  }

  Start() {
    this.loop.Start();
  }

  AddObject(object) {
    this.config.scene.add(object);
  }

  AddMesh(mesh) {
    this.loop.Add(mesh);
    this.config.scene.add(mesh.mesh);
  }

  async AddMeshAsync(mesh) {
    this.loop.Add(mesh);
    this.config.scene.add(mesh.mesh);
  }

  async AddAsync(object) {
    this.loop.Add(object);
    this.config.scene.add(object.mesh);
  }

  Stop() {
    this.loop.Stop();
  }

  Render() {
    this.renderer.render(this.scene, this.camera);
    this.config.stats.update();
  }
}
