import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Config } from "./config";

export class Bootstrap {
  renderer;
  scene;
  camera;
  axesHelper;
  stats;
  control;
  gui;

  constructor() {
    this._Init();
    this.GetConfig();
  }

  _Init() {
    const canvas = document.querySelector("#my_canvas");
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    this.renderer.shadowMap.enabled = true;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.rotateX(-Math.PI * 0.5);
    this.scene.background = new THREE.Color("skyblue");

    this.camera = this.CreateCamera();
    this.axesHelper = this.CreateAxesHelper();
    this.stats = this.CreateStat();
    this.control = this.CreateControl(this.camera);

    this.scene.add(this.axesHelper);

    const config = new Config();
    this.gui = config.Init();

    window.addEventListener("resize", this.OnWindowResize, false);
  }

  CreateCamera() {
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    camera.position.set(70, 100, 0);
    return camera;
  }

  CreateAxesHelper() {
    const axesHelper = new THREE.AxesHelper(3);

    return axesHelper;
  }

  CreateStat() {
    const stats = Stats();
    document.body.appendChild(stats.dom);
    return stats;
  }

  CreateControl() {
    const orbCtl = new OrbitControls(this.camera, this.renderer.domElement);
    orbCtl.update();

    /* NOTE:
     * Only re-render when the control change gives us better performance
     * */
    orbCtl.addEventListener("change", () => {
      this.renderer.render(this.scene, this.camera);
    });

    // orbCtl.dampingFactor = 0.07;
    // orbCtl.enableDamping = true;

    return orbCtl;
  }

  Render() {
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

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.render(this.scene, this.camera);
  }

  GetConfig() {
    const appConfig = this.gui.addFolder("App Config");
  }
}
