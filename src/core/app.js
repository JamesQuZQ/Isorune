import { Bootstrap } from '@/core/bootstrap';
import { Loop } from '@/core/loop';
import { Character } from '@/objects/character/character';
import { Terrain } from '@/objects/terrain/terrain';
import { Debugger } from '@/tools/debugger';
import { AmbientLight, Vector2 } from 'three';

/** @import { Scene, WebGLRenderer, Camera, Mesh, Object3D  } from 'three'; */
/** @import { Bootstrap } from '@/core/bootstrap'; */

/** Apply Singleton Pattern
 *  @property {App} instance
 *  @property {Bootstrap} config
 *  @property {Loop} loop
 *  @property {Scene} scene
 *  @property {WebGLRenderer} renderer
 *  @property {Camera} camera
 *
 * */
export class App {
  static #_instance;

  constructor() {
    if (App.#_instance) {
      return App.#_instance;
    }

    App.#_instance = this;
  }

  get instance() {
    if (typeof App.#_instance == 'undefined') {
      throw new Error('The App has not been instanciate yet');
    }

    return App.#_instance;
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
    this.debugger = new Debugger();
    this.config = new Bootstrap(this.debugger);
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    window.addEventListener('resize', this.config.OnWindowResize, false);

    const amlight = new AmbientLight(0xffffff, 1);
    this.AddObject(amlight);
  }

  async StartAsync() {
    this.loop.Start();

    const terrain = new Terrain(this.debugger);
    await terrain.InitTextureAsync();
    await terrain.GenerateAsync(2, 50);

    // const character = new Character(new Vector2(5, 5));
    // await this.AddMeshAsync(character);
  }

  AddObject(object) {
    this.scene.add(object);
  }

  AddMesh(object) {
    this.scene.add(object.mesh);
  }

  async AddMeshAsync(object) {
    this.loop.Add(object);
    this.scene.add(object.mesh);
  }

  async AddAsync(object) {
    this.loop.Add(object);
    this.scene.add(object);
  }

  /**
   * @param {Object3D} object
   * */
  DisposeMesh(object) {
    this.scene.remove(object);
    this.renderer.renderLists.dispose();
  }

  Render() {
    this.renderer.render(this.scene, this.camera);
  }

  Stop() {
    this.loop.Stop();
  }
}
