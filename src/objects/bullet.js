import { PointLight, SphereGeometry, MeshStandardMaterial, Mesh, Color, Object3D } from 'three';

const BULLET_MAX_LIFESPAN = 10;

export class MachineGunBullet extends Mesh {
  constructor(position, speed, rotation, app) {
    const geometry = new SphereGeometry(0.1, 32, 32);
    geometry.scale(0.05, 0.005, 0.005); // Ellipsoid shape

    const material = new MeshStandardMaterial({ color: new Color().setHex(0xC4A484) });

    super(geometry, material); // Call Mesh constructor with geometry and material

    this.castShadow = true;
    this.receiveShadow = true;

    this.position.copy(position);
    this.rotation.copy(rotation);

    this.speed = speed;
    this.app = app;
    this.lifespan = 0;
    this.geometry.computeBoundingBox();
  }

  Tick(delta) {
      this.translateX(this.speed);
      this.lifespan += delta;
      if (this.lifespan >= BULLET_MAX_LIFESPAN){
        this.app.DisposeObject(this);
      }
      for (var plane of this.app.planeCtrl.planes) {
        // Clone and apply world transforms
        const bulletBox = this.geometry.boundingBox.clone();
        bulletBox.applyMatrix4(this.matrixWorld);
  
        const planeBox = plane.bBox.clone();
        planeBox.applyMatrix4(plane.matrixWorld);
  
        // Collision detection
        if (bulletBox.intersectsBox(planeBox)) {
          console.log("Hit!");
          this.app.DisposeObject(this); // Remove bullet
          plane.hitpoint -= 10;
          // this.app.HandlePlaneHit(plane); // You can define this method
          break;
        }
      }
  
    };
}