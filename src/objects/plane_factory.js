import { MIN_SPEED } from '@/logics/player_interaction_control';
import { MTLLoader } from 'three/examples/jsm/Addons';
import { OBJLoader } from 'three/examples/jsm/Addons';
import { Quaternion, Euler } from 'three';


const MIN_PLANE_NUM = 1;
const MAX_PLANE_NUM = 6;

export class PlaneFactory {  

  constructor(app) {
    this.app = app
    this.playerNumber = 0;
  }

  async createPlayer(planeNumber){
    const mtlLoader = new MTLLoader();
    this.playerNumber = planeNumber;
    mtlLoader.setPath('src/assets/planes/'); 
    mtlLoader.load(`Plane0${planeNumber}.mtl`, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('src/assets/planes/');        
      // objLoader.load(`PTest.obj`, (object) => {

      objLoader.load(`Plane0${planeNumber}.obj`, (object) => {
        object.position.y = 40;
        object.rotation.y = -Math.PI / 2;
        object.speed = MIN_SPEED;
        object.sidewaySpeed = 0;
        object.scale.set(0.01, 0.01, 0.01);
        object.Tick = () => {
          object.translateX(object.speed);
          object.position.set(object.position.x - object.sidewaySpeed * 0.5, object.position.y, object.position.z);
          // const worldZ = new THREE.Veactor3(0, 0, -1);
          // object.translateOnAxis(worldZ, object.sidewaySpeed);
        }
        this.app.player = object;
        this.app.AddAsync(object);
      // this.app.camera.position.set( -10, 0, 0 ); 
      // this.app.camera.lookAt( 0, 0, 0 );
      // object.add(this.app.camera);
      //   this.app.camera.rotation.x -= Math.PI / 4;
      //   this.app.camera.position.set(this.app.player.position.x, 
      //     this.app.player.position.y + 0.1, this.app.player.position.z - 0.15);
        
        this.app.camera.updateProjectionMatrix();

      //   this.app.camera.lookAt(object.position);
      }, 
      (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
      (error) => console.error('An error happened while loading the OBJ:', error));
    });

  }


  async createPlane(position){
    // const planeNumber = this.getRandomPlaneNum();
    const planeNumber = 6;
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('src/assets/planes/'); 
    mtlLoader.load(`Plane0${planeNumber}.mtl`, (materials) => {
      materials.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('src/assets/planes/');
      objLoader.load(`Plane0${planeNumber}.obj`, (object) => {
        object.speed = MIN_SPEED;
        object.scale.set(0.01, 0.01, 0.01);
        object.rotation.y -= Math.random() * Math.PI;

        object.position.copy(position);
        object.Tick = () => {
          object.translateX(object.speed);
          object.translateZ(object.speed / 2);
        }
        this.app.AddAsync(object);
        this.app.planeCtrl.planes.push(object);
      }, 
      (xhr) => console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`),
      (error) => console.error('An error happened while loading the OBJ:', error));
    });

  }

  getRandomPlaneNum() {
    const minCeiled = MIN_PLANE_NUM;
    const maxFloored = MAX_PLANE_NUM + 1;
    const result = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
    return result == this.playerNumber ? this.getRandomPlaneNum() : result;
  }

}