import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Debugger } from '@/tools/debugger';

/**
 * @property {THREE.Scene} scene
 */
export class Bootstrap {
  constructor() {
    this.#Init();
    this.GetConfig();
  }

  #Init() {
    this.renderer = this.CreateRenderer();

    this.scene = new THREE.Scene();
    this.scene.rotateX(-Math.PI * 0.5);
    this.scene.background = new THREE.Color('#96c5fa');

    this.camera = this.CreateCamera();
    this.axesHelper = this.CreateAxesHelper();
    this.stats = this.CreateStat();
    this.control = this.CreateControl(this.camera);

    this.scene.add(this.axesHelper);

    this.debugger = new Debugger();
  }

  CreateRenderer() {
    const canvas = document.querySelector('#my_canvas');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = PCFSoftShadowMap;
    return renderer;
  }

  CreateCamera() {
    // const camera = new THREE.PerspectiveCamera(
    //   50,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000,
    // );
    const camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 1000);
    camera.position.set(30, 35, -10);
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
    orbCtl.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera);
    });

    // orbCtl.dampingFactor = 0.07;
    // orbCtl.enableDamping = true;

    return orbCtl;
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
    const appConfig = this.debugger.addFolder('App Config');
  }
}
