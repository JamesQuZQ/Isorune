import * as THREE from "three";
import { createMultiMaterialObject } from "three/examples/jsm/utils/SceneUtils";

export class Terrain {
  constructor(app, color = 0x000000) {
    this.color = new THREE.Color(color);
    this.Init(app);
    this._GetConfig(app.gui);
  }

  Init(app) {
    this._Create();
    app.scene.add(this.mesh);
  }

  ReBuild() {
    this.geo.verticesNeedUpdate = true;
    this.geo.computeVertexNormals();
  }

  _GetConfig(gui) {
    const terrainConfig = gui.addFolder("Terrain Config");
  }

  bufferGeometryimport = undefined;

  updateCustomGeometry = (scene, faces) => {
    bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(faces, 3),
    );
    bufferGeometry.computeVertexNormals();

    const mesh = meshFromGeometry(bufferGeometry);
    mesh.name = "customGeometry";
    // remove the old one
    const p = scene.getObjectByName("customGeometry");
    if (p) scene.remove(p);

    // add the new one
    scene.add(mesh);
    return { mesh: mesh, geometry: bufferGeometry };
  };

  meshFromGeometry = (geometry) => {
    var materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
      new THREE.MeshLambertMaterial({
        opacity: 0.1,
        color: 0xff0044,
        transparent: true,
      }),
    ];

    var mesh = createMultiMaterialObject(geometry, materials);
    mesh.name = "customGeometry";
    mesh.children.forEach(function (e) {
      e.castShadow = true;
    });

    return mesh;
  };

  _Create = () => {
    this.geo = new THREE.PlaneGeometry(20, 20, 20, 20);
    this.mat = new THREE.MeshBasicMaterial({
      color: this.color,
      wireframe: true,
    });

    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh.position.z = -0.5;
  };
}
