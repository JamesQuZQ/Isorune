import * as THREE from "three";
import grassTexture from "./assets/textures/grass.jpg";
// import rockTexture from "./assets/textures/rock.jpg";
// import dirtTexture from "./assets/textures/dirt.jpg";
// import snowTexture from "./assets/textures/snow.jpg";

export class Terrain {
  #textures;
  #geocontainers;

  constructor(color = 0x000000) {
    this.color = new THREE.Color(color);
    this.#textures = new Map();
    this.#geocontainers = new Map();
    this.chunks = new Array(4);

    this.#Init();
  }

  get width_limit() {
    return 200;
  }

  get height_limit() {
    return 200;
  }

  #Init() {
    this.#InitBoxTexture();
  }

  #InitBoxTexture() {
    this.#textures["grass"] = new THREE.TextureLoader().load(grassTexture);
    // this.#textures["dirt"] = new THREE.TextureLoader().load();
    // this.#textures["rock"] = new THREE.TextureLoader().load();
    // this.#textures["snow"] = new THREE.TextureLoader().load();
  }

  GetTexture(key) {
    return this.#textures.get(key);
  }
}
