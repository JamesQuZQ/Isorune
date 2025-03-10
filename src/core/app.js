import { Bootstrap } from '@/core/bootstrap';
import { Loop } from '@/core/loop';

export class App {
  //Using Singleton Pattern
  static _instance;

  constructor() {
    if (App._instance) {
      return App._instance;
    }

    App._instance = this;

    this.config = new Bootstrap();
    this.loop = new Loop(this.camera, this.scene, this.renderer);

    window.addEventListener('resize', this.config.OnWindowResize, false);
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
