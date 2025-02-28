import { Application } from "./bootstrap";
import { Box } from "./box";
import { Terrain } from "./terrain";
import { randomTerrain } from "./random_terrain";

function Main() {
  function GenerateTarrain(terrain) {
    const rTerrain = randomTerrain();
    const segmentX = 20;
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        const vertexIndex = y * (segmentX + 1) + x;
        terrain.geometry.attributes.position.setZ(vertexIndex, rTerrain[x][y]);
      }
    }
  }

  const app = new Application();

  const terrain = new Terrain(app);

  for (let x = 0; x < 10; x++) {
    const box = new Box(app).RandomPlace();
  }

  const character = new Box(app, 0xff0000);

  function anime(time) {
    app.Render();
  }

  app.renderer.setAnimationLoop(anime);
}

Main();
