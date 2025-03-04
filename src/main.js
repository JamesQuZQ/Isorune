import { Box } from "./box";
import { GeoContainer } from "./geo_container";
import { App } from "./app";
import { AmbientLight, Vector3 } from "three";

//NOTE: set mesh.matrixAutoUpdate = false for static assets in the scene to boost performance

async function main() {
  const app = new App();

  // const amlight = new AmbientLight(0xffffff, 0.5);
  // app.Add(amlight);

  // const terrain = new Terrain().BuildRandomMap(app.noise);
  // app.Add(terrain);

  // terrain.Tick = (delta) => {
  //   terrain.geo.rotateY(0.5 * delta);
  // };

  const character = new Box(0xff0000, new Vector3(0, 0, 1)).Create_Singular();
  app.Add(character);

  const vecPos = new Vector3();
  const container2 = new GeoContainer();
  for (let y = 0; y < 25; y++) {
    for (let x = 0; x < 25; x++) {
      vecPos.set(x, y, app.noise.Get2D(x, y));
      container2.Merge(new Box(0xffff00, vecPos).Create_Multiple());
    }
  }

  const container_mesh_2 = container2.Build();
  app.Add(container_mesh_2);
  //
  // document.addEventListener("keydown", (event) => {
  //   console.log(event);

  // if (event.key == "+") {
  // }
  // });

  app.Start();
}

await main();
