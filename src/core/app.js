import { Bootstrap } from '@/core/bootstrap';
import { Loop } from '@/core/loop';
import { Terrain } from '@/objects/terrain';
import { AmbientLight } from 'three';

/** Apply Singleton Pattern
 *  @property {Bootstrap} config
 *  @property {Loop} loop
 * */
export class App {
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

  async InitAsync() {
    const amlight = new AmbientLight(0xffffff, 1);
    this.AddObject(amlight);
  }

  async StartAsync() {
    this.loop.Start();

    const terrain = new Terrain();
    await terrain.InitTextureAsync();
    await terrain.GenerateAsync(this);
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
    this.config.scene.add(object);
  }

  Stop() {
    this.loop.Stop();
  }

  Render() {
    this.renderer.render(this.scene, this.camera);
    this.config.stats.update();
  }
}
