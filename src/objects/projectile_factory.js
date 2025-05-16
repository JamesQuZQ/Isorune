import * as THREE from 'three';
import { TextureLoader, MeshStandardMaterial } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/Addons';
import { MachineGunBullet } from './bullet';

export class ProjectileFactory {

  constructor(app) {
      this.app = app
  }

async createMachineGunBullet(position, speed, rotation) {
  const bullet = new MachineGunBullet(position, rotation);
  
  bullet.mesh.speed = speed;

  bullet.mesh.Tick = function () {
    this.translateX(this.speed);
  };

  await this.app.AddAsync(bullet.mesh);

}


  async createMissile(missileNum, position, speed) {
    const loader = new FBXLoader();
    const textureLoader = new TextureLoader();

    // Load texture first
    const texture = await new Promise((resolve, reject) => {
      textureLoader.load('src/assets/missiles/Blue.png', resolve, undefined, reject);
    });

    loader.load(
      'src/assets/missiles/Rocket1.fbx', // path to your .fbx file
      (object) => {
        object.position.copy(position);
        object.speed = speed;
        object.scale.set(0.005,0.005,0.005);
        // object.rotation.x = Math.PI / 2;
        object.rotation.x += Math.PI / 2;
        // Apply texture to all meshes
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new MeshStandardMaterial({
              map: texture,
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        object.Tick = () => {
            //TODO: Implement Auto-tracking function
            object.translateY(object.speed);
          }
        this.app.AddAsync(object);
        // console.log(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded for rocket');
      },
      (error) => {
        console.error('An error happened while loading the FBX:', error);
      }
    );
  }

  async createBomb(missileNum, position, speed) {
    const loader = new FBXLoader();
    const textureLoader = new TextureLoader();

    // Load texture first
    const texture = await new Promise((resolve, reject) => {
      textureLoader.load('src/assets/missiles/Red.png', resolve, undefined, reject);
    });

    loader.load(
      'src/assets/missiles/Rocket7.fbx', // path to your .fbx file
      (object) => {
        object.position.copy(position);
        object.speed = speed;
        object.scale.set(0.002,0.002,0.002);
        // object.rotation.x = Math.PI / 2;
        object.rotation.x += Math.PI / 2;
        // Apply texture to all meshes
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new MeshStandardMaterial({
              map: texture,
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        object.Tick = () => {
            object.translateZ(object.speed);
          }
        this.app.AddAsync(object);
        // console.log(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded for rocket');
      },
      (error) => {
        console.error('An error happened while loading the FBX:', error);
      }
    );
  }
}