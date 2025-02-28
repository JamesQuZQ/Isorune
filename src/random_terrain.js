export function randomTerrain() {
  const segmentX = 20;

  let cols = 20; // Example value
  let rows = 20; // Example value

  const randomTerrain = new Array(cols)
    .fill()
    .map(() => new Array(rows).fill(0));
  let yoff = 0; // Y offset

  for (let y = 0; y < rows; y++) {
    let xoff = 0; // X offset
    for (let x = 0; x < cols; x++) {
      // Using Perlin noise (Assuming noise function is available)
      randomTerrain[x][y] = map(Math.random(xoff, yoff), 0, 1, -1, 3);
      xoff += 0.01;
    }
    yoff += 0.01;
  }

  // Mapping function similar to Processing's `map()`
  function map(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  return randomTerrain;
}
