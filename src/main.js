import { App } from '@/core/app';

//NOTE: set mesh.matrixAutoUpdate = false for static assets in the scene to boost performance

async function main() {
  const app = new App();
  await app.InitAsync();
  await app.StartAsync();
}

await main();
