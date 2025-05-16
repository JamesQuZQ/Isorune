import { PointLight, SphereGeometry, MeshStandardMaterial, Mesh, Color, Object3D } from 'three';

export class MachineGunBullet {
  constructor(position, rotation) {
    // Create ellipsoid geometry by scaling a sphere
    const geometry = new SphereGeometry(0.1, 32, 32); // base sphere
    geometry.scale(0.05,0.005,0.005); // scale to ellipsoid shape

    const material = new MeshStandardMaterial({ color: new Color().setHex( 0xC4A484 ) });

    this.mesh = new Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Optional: Set initial position or other properties
    this.mesh.position.copy(position);
    this.mesh.rotation.copy(rotation);
  }
  // constructor(position) {
  //   // Create a PointLight
  //   const light = new PointLight(0xffffc1, 1, 5); // color, intensity, distance
  //   light.castShadow = true;
  //   light.position.copy(position);

  //   // Optional: add a small visible mesh to represent the bullet
  //   const geometry = new SphereGeometry(0.02, 16, 16); // small glowing sphere
  //   const material = new MeshStandardMaterial({
  //     color: new Color(0xffffc1),
  //     emissive: new Color(0xffffc1),
  //     emissiveIntensity: 1,
  //   });
  //   const glow = new Mesh(geometry, material);
  //   glow.castShadow = false;

  //   // Attach glow to the light
  //   light.add(glow);

  //   this.mesh = light;
  // }
}
