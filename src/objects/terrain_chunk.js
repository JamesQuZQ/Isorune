import { BoxGeometry } from 'three';
import { GeoContainer } from '@/objects/geo_container';

export class Chunk {
  static SNOW_HEIGHT = 40;
  static MOUNTANTROCk_HEIGHT = 27;
  static STONE_HEIGHT = 10;
  static GRASS_HEIGHT = 3;
  static SAND_HEIGHT = 0.4;
  static SOIL_HEIGHT = 0;
  static RIVER_HEIGHT = 0.2;

  static MAX_TERRAIN_HEIGHT = 70;

  constructor(textures, edge, size, envmap) {
    this.edge = edge;
    this.size = size;
    this.chunk_id = 0;
    this.index = 0;

    this.#InitBiome(textures, envmap);
  }

  #InitBiome(textures, envmap) {
    this.biomes = {
      grass: new GeoContainer(textures['grass'], envmap),
      rock: new GeoContainer(textures['mountantRock'], envmap),
      stone: new GeoContainer(textures['rock'], envmap),
      snow: new GeoContainer(textures['snow'], envmap),
      soil: new GeoContainer(textures['soil'], envmap),
      sand: new GeoContainer(textures['sand'], envmap),
    };
  }

  CreateChunk(noise) {
    for (let y = this.edge.y; y < this.edge.y + this.size.y; y++) {
      for (let x = this.edge.x; x < this.edge.x + this.size.x; x++) {
        const height = noise.GetOctave(x, y) * Chunk.MAX_TERRAIN_HEIGHT;

        const geo = new BoxGeometry(1, 1, height);
        geo.translate(x, y, height * 0.5);

        if (Chunk.SNOW_HEIGHT < height) {
          this.biomes.snow.Merge(geo);
        } else if (Chunk.MOUNTANTROCk_HEIGHT < height) {
          this.biomes.rock.Merge(geo);
        } else if (Chunk.STONE_HEIGHT < height) {
          this.biomes.stone.Merge(geo);
        } else if (Chunk.GRASS_HEIGHT < height) {
          this.biomes.grass.Merge(geo);
        } else if (Chunk.SAND_HEIGHT < height) {
          this.biomes.sand.Merge(geo);
        } else if (Chunk.SOIL_HEIGHT < height) {
          this.biomes.soil.Merge(geo);
        }

        geo.dispose();
      }
    }

    return this;
  }
}
