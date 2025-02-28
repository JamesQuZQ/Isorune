const pos = terrain.geometry.attributes.position;

for (let y = 0; y < 20; y++) {
  for (let x = 0; x < 20; x++) {
    const vertexIndex = y * (segmentX + 1) + x;
    pos.setZ(vertexIndex, randomTerrain[x][y]);
  }
}

console.log(terrain.geometry.vertices);

pos.needsUpdate = true;
terrain.geometry.attributes.position.needsUpdate = true;
// terrain.geometry.computeVertexNormals();
