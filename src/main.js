import { App } from '@/core/app';
import { Terrain } from '@/objects/terrain';
import { AmbientLight, Vector2 } from 'three';

//NOTE: set mesh.matrixAutoUpdate = false for static assets in the scene to boost performance

async function main() {
  const app = new App();

  app.Start();

  const amlight = new AmbientLight(0xffffff, 1);
  app.AddObject(amlight);

  const terrain = new Terrain().Generate(app);

  // app.Stop();
}

await main();
