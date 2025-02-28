import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Config } from "./config";

export class Application {
  constructor() {
    this._Init();
    this._GetConfig();
  }

  _Init() {
    const canvas = document.querySelector("#my_canvas");

    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.rotateX(-Math.PI * 0.5);
    this.scene.background = new THREE.Color(0xf1f1f1f1);

    this.camera = this._CreateCamera();
    this.axesHelper = this._CreateAxesHelper();
    this.stats = this._CreateStat();
    this.control = this._CreateControl(this.camera);

    this.scene.add(this.axesHelper);

    const config = new Config();
    this.gui = config.Init();

    window.addEventListener("resize", this.OnWindowResize, false);
  }

  _CreateCamera() {
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    camera.position.set(7, 10, 0);
    return camera;
  }

  _CreateAxesHelper(scene) {
    const axesHelper = new THREE.AxesHelper(3);
    return axesHelper;
  }

  _CreateStat() {
    const stats = Stats();
    document.body.appendChild(stats.dom);

    return stats;
  }

  _CreateControl() {
    const orbCtl = new OrbitControls(this.camera, this.renderer.domElement);
    orbCtl.update();
    return orbCtl;
  }

  Render(time) {
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

  OnWindowResize() {
    // const canvas = this.renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    // const canvasPixelW = canvas.width / window.devicePixelRatio;
    // const canvasPixelH = canvas.height / window.devicePixelRatio;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(scene, camera);
  }

  _GetConfig() {
    const appConfig = this.gui.addFolder("App Config");
  }
}
