import { Bootstrap } from "./bootstrap";
import { Box } from "./box";
import { Terrain } from "./terrain";
import { GeoContainer } from "./geo_container";
import { App } from "./app";
import { Vector3 } from "three";

//NOTE: set mesh.matrixAutoUpdate = false for static assets in the scene to boost performance

function main() {
  const config = new Bootstrap();
  const app = new App(config);
  // const terrain = new Terrain();
  // const character = new Box(0xff0000, new Vector3(0, 0, 1));

  // const container = new GeoContainer();
  // for (let index = 0; index < 5; index++) {
  //   container.Merge(
  //     new Box(
  //       0xffff00,
  //       new Vector2(Math.random(1, 2) * 9, Math.random(1, 2) * 9),
  //       Math.floor(Math.random(1, 2) * 9),
  //     ).Create_Multiple(),
  //   );
  // }
  // const container_mesh = container.Build();
  // app.scene.add(container_mesh);

  app.Start();
}

main();
