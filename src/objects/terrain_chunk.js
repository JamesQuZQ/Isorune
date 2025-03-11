import { BoxGeometry } from 'three';
import { BlockTypeContainer } from '@/objects/geo_container';

/**
 * @property {GeoContainer[]} blockTypes
 * */
export class Chunk {
  static SNOW_HEIGHT = 40;
  static MOUNTANTROCk_HEIGHT = 27;
  static STONE_HEIGHT = 10;
  static GRASS_HEIGHT = 3;
  static SAND_HEIGHT = 0.4;
  static SOIL_HEIGHT = 0;
  static RIVER_HEIGHT = 0.2;

  static MAX_TERRAIN_HEIGHT = 70;

  constructor(textures, edge, size, envmap, levelOfDetail) {
    this.edge = edge;
    this.size = size;
    this.chunk_id = 0;
    this.index = 0;
    this.levelOfDetail = levelOfDetail;
    this.#InitBlockTypes(textures, envmap);
  }

  #InitBlockTypes(textures, envmap) {
    this.blockTypes = {
      grass: new BlockTypeContainer(textures['grass'], envmap),
      rock: new BlockTypeContainer(textures['mountantRock'], envmap),
      stone: new BlockTypeContainer(textures['rock'], envmap),
      snow: new BlockTypeContainer(textures['snow'], envmap),
      soil: new BlockTypeContainer(textures['soil'], envmap),
      sand: new BlockTypeContainer(textures['sand'], envmap),
    };
  }

  async CreateChunkAsync(noise) {
    for (
      let y = this.edge.y;
      y < this.edge.y + this.size;
      y += this.levelOfDetail
    ) {
      for (
        let x = this.edge.x;
        x < this.edge.x + this.size;
        x += this.levelOfDetail
      ) {
        const height = noise.GetOctave(x, y) * Chunk.MAX_TERRAIN_HEIGHT;

        const block_geo = new BoxGeometry(
          1 * this.levelOfDetail,
          1 * this.levelOfDetail,
          height,
        );
        block_geo.translate(x, y, height * 0.5);

        if (Chunk.SNOW_HEIGHT < height) this.blockTypes.snow.Merge(block_geo);
        else if (Chunk.MOUNTANTROCk_HEIGHT < height)
          this.blockTypes.rock.Merge(block_geo);
        else if (Chunk.STONE_HEIGHT < height)
          this.blockTypes.stone.Merge(block_geo);
        else if (Chunk.GRASS_HEIGHT < height)
          this.blockTypes.grass.Merge(block_geo);
        else if (Chunk.SAND_HEIGHT < height)
          this.blockTypes.sand.Merge(block_geo);
        else if (Chunk.SOIL_HEIGHT < height)
          this.blockTypes.soil.Merge(block_geo);

        block_geo.dispose();
      }
    }

    return this;
  }
}
