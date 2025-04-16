import { Bootstrap } from '@/core/bootstrap';
import { Loop } from '@/core/loop';
import ControlService from '@/logics/control';
import { Character } from '@/objects/character/character';
import { Terrain } from '@/objects/terrain/terrain';
import { Debugger } from '@/tools/debugger';
import { Vector2 } from '@/utils/vector_helper';
import {
  AmbientLight,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Vector3,
} from 'three';

/** @import { Scene, WebGLRenderer, Camera, Mesh, Object3D  } from 'three'; */
/** @import { Bootstrap } from '@/core/bootstrap'; */

/** Apply Singleton Pattern
 *  @property {App} instance
 *  @property {Bootstrap} config
 *  @property {Loop} loop
 *  @property {Scene} scene
 *  @property {WebGLRenderer} renderer
 *  @property {Camera} camera
 *  @property {Debugger} debugger
 * */
export class App {
  static _instance;

  constructor() {
    if (App._instance) {
      return App._instance;
    }

    App._instance = this;
    this.entities = [];
    this.state = 0;
  }

  get instance() {
    if (typeof App._instance == 'undefined') {
      throw new Error('The App has not been instanciate yet');
    }

    return App._instance;
  }

  /** @return {Scene} */
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
    App._instance = new App();

    this.debugger = new Debugger();
    this.config = new Bootstrap(this.debugger);
    this.loop = new Loop(this.renderer, this.scene, this.camera);
    window.addEventListener('resize', this.config.OnWindowResize, false);

    const amlight = new AmbientLight(0xffffff, 1);
    this.AddObject(amlight);
  }

  async StartAsync() {
    this.loop.Start(this.Render);

    const terrain = new Terrain(this.debugger, this.config.texture);

    console.time('terrain generate');

    // await terrain.AppendChunkAsync(new Vector2(0, 0), 1);
    // await terrain.AppendChunkAsync(new Vector2(0, 1), 1);
    // await terrain.AppendChunkAsync(new Vector2(1, 1), 6);
    console.timeEnd('terrain generate');

    console.time('render');
    terrain.RenderChunks((object) => {
      this.AddObject(object);
    });

    console.timeEnd('render');

    const character = new Character(new Vector2(75, 75));
    this.AddObject(character.mesh);

    const controlSrv = new ControlService(terrain, character, this);
    this.AddToLoop(controlSrv);
  }

  AddToLoop(object) {
    this.loop.Add(object);
  }

  AddObject(object) {
    this.scene.add(object);
  }

  /** Dispose Object in the scene
   * @param {Object3D} object
   * */
  DisposeObject(object) {
    this.scene.remove(object);
    this.renderer.renderLists.dispose();
  }

  Render() {
    this.renderer.render(this.scene, this.camera);
    this.config.stats;
  }

  Stop() {
    this.loop.Stop();
  }
}
