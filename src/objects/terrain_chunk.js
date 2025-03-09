import { Vector2 } from "three";
import { Box } from "./box";
import { GeoContainer } from "./geo_container";

export class Chunk {
  constructor(textures, edge, size, envmap) {
    this.edge = edge;
    this.size = size;
    this.chunk_id = 0;
    this.index = 0;

    this.#InitBiome(textures, envmap);
  }

  #InitBiome(textures, envmap) {
    this.biomes = {
      grass: new GeoContainer(textures["grass"], envmap),
      rock: new GeoContainer(textures["mountantRock"], envmap),
      stone: new GeoContainer(textures["rock"], envmap),
      snow: new GeoContainer(textures["snow"], envmap),
      soil: new GeoContainer(textures["soil"], envmap),
      sand: new GeoContainer(textures["sand"], envmap),
    };
  }

  NewEdge(newEdge) {
    this.edge.x = newEdge.x;
    this.edge.y = newEdge.y;
  }

  Create(noise) {
    const vecPos = new Vector2();

    const grass = [];
    const rock = [];
    const stone = [];
    const snow = [];
    const soil = [];
    const sand = [];
    for (let y = this.edge.y; y < 40; y++) {
      for (let x = this.edge.x; x < 40; x++) {
        const height = noise.GetOctave(x, y);
        vecPos.set(x, y);
        const box = new Box().CreateGeometry();
        box.SetPos(vecPos, height);
        if (height > 30) {
          snow.push(box.geo);
        } else if (25 < height) {
          rock.push(box.geo);
        } else if (12 < height) {
          stone.push(box.geo);
        } else if (2 < height) {
          grass.push(box.geo);
        } else if (0.5 < height) {
          sand.push(box.geo);
        } else if (0 < height) {
          soil.push(box.geo);
        }
      }
    }

    this.biomes.grass.Merge(grass);
    this.biomes.rock.Merge(rock);
    this.biomes.snow.Merge(snow);
    this.biomes.stone.Merge(stone);
    this.biomes.soil.Merge(soil);
    this.biomes.sand.Merge(sand);
    return this;
  }
}
