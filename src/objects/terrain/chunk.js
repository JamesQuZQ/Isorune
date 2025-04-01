import { BoxGeometry, Group, Vector2 } from 'three';
import { BlockTypeContainer } from '@/objects/terrain/container';

/** @import { Noise } from '@/logics/noise'*/
/** @import { Vector2 } from 'three'*/

/**
 * @property {GeoContainer[]} blockTypes
 * @property {Vector2} edge
 * @property {number} size
 * @property {Group} group
 *
 * */
export class Chunk {
  static SNOW_HEIGHT = 40;
  static MOUNTANTROCk_HEIGHT = 27;
  static STONE_HEIGHT = 10;
  static GRASS_HEIGHT = 3;
  static SAND_HEIGHT = 0.4;
  static SOIL_HEIGHT = 0;
  static RIVER_HEIGHT = 0.2;

  /**
   * @param {*} textures
   * @param {Vector2} edge
   * @param {number} size
   * @param {*} envmap
   * @param {number} levelOfDetail
   * */
  constructor(textures, edge, size, envmap, levelOfDetail) {
    this.coordinate = new Vector2().copy(edge);
    this.size = size;
    this.edge = new Vector2(edge.x * size, edge.y * size);
    this.LOD = levelOfDetail;
    this.#InitBlockTypes(textures, envmap);
    this.group = new Group();
  }

  #InitBlockTypes(textures, envmap) {
    this.blockTypes = {
      grass: new BlockTypeContainer(textures['grass']),
      rock: new BlockTypeContainer(textures['mountantRock']),
      stone: new BlockTypeContainer(textures['rock']),
      snow: new BlockTypeContainer(textures['snow']),
      soil: new BlockTypeContainer(textures['soil']),
      sand: new BlockTypeContainer(textures['sand']),
    };
  }

  /**
   * @param {Noise} noise - The Noise seed
   * @param {NoiseConfig} noiseProps
   * @param {number} max_height
   * */
  async CreateAsync(noise, noiseProps, max_height) {
    for (
      let y = this.coordinate.y * this.size;
      y < this.coordinate.y * this.size + this.size;
      y += this.LOD
    ) {
      for (
        let x = this.coordinate.x * this.size;
        x < this.coordinate.x * this.size + this.size;
        x += this.LOD
      ) {
        const height = Math.floor(noise.Get2D(x, y, noiseProps) * max_height);
        for (let z = 0; z <= height; z++) {
          const block_geo = new BoxGeometry(1 * this.LOD, 1, 1 * this.LOD);

          block_geo.translate(x + this.LOD * 0.5, z * 0.5, y + this.LOD * 0.5);

          if (Chunk.SNOW_HEIGHT < height) this.blockTypes.snow.Merge(block_geo);
          else if (Chunk.MOUNTANTROCk_HEIGHT < height)
            this.blockTypes.rock.Merge(block_geo);
          else if (Chunk.STONE_HEIGHT < height)
            this.blockTypes.stone.Merge(block_geo);
          else if (Chunk.GRASS_HEIGHT < height)
            this.blockTypes.grass.Merge(block_geo);
          else if (Chunk.SAND_HEIGHT < height)
            this.blockTypes.sand.Merge(block_geo);
          else if (Chunk.SOIL_HEIGHT <= height)
            this.blockTypes.soil.Merge(block_geo);

          block_geo.dispose();
        }
      }
    }

    return this;
  }

  async BuildAsync() {
    for (const [_, value] of Object.entries(this.blockTypes)) {
      /** @type {BlockTypeContainer} geoContainer*/
      const geoContainer = await value.BuildAsync();
      this.group.add(geoContainer.mesh);
    }

    return this;
  }

  /**
   * @param {Vector3} vector3
   *
   * @returns {boolean}
   * */
  IsInBounding(vector3) {
    return !(
      vector3.x < this.coordinate.x * this.size + this.size &&
      this.coordinate.x * this.size > vector3.x
    );
  }

  Dispose() {
    this.group.children.forEach((geo) => {
      geo.material.dispose();
      geo.geometry.dispose();
    });
  }

  Hide() {
    this.group.visible = false;
  }

  Show() {
    this.group.visible = true;
  }
}
