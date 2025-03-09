import { App } from '@/app';
import { Terrain } from '@/objects/terrain';
import { AmbientLight } from 'three';

//NOTE: set mesh.matrixAutoUpdate = false for static assets in the scene to boost performance

async function main() {
  const app = new App();

  app.Start();

  const amlight = new AmbientLight(0xffffff, 1);
  app.AddObject(amlight);

  const terrain = new Terrain({ pmrem: app.config.pmrem });
  const terrain_chunk = terrain.CreateChunk();

  for (const [_, value] of Object.entries(terrain_chunk.biomes)) {
    const mesh = value.Build();
    app.AddMesh(mesh);
  }
}

await main();
