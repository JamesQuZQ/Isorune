import { BLOCkS } from '@/game_config/block';
import ThreeHelper from '@/utils/three_helper';
import Voxel, { VoxelFace, VoxelType } from './voxel';

/** @import { Terrain } from '@/objects/terrain/terrain'*/

export default class Biome {
  voxels = new Array(10);
  constructor() {
    this.#CreateWorldVoxel();
  }

  /**
   * @param {VoxelType} type
   *
   * @returns {Voxel}
   * */
  GetVoxel(type) {
    return this.voxels[type];
  }

  #CreateWorldVoxel() {
    const {
      tileSize,
      atlasWidth,
      atlasHeight,
      grass,
      water,
      dirt,
      sand,
      snow,
    } = BLOCkS;

    const CreateVoxel = (type, texture) => {
      if (this.voxels[type] != null) return;

      const voxel = new Voxel(type);
      voxel.SetAllFacesUVCoordinate(
        ThreeHelper.GetUVFromSubTexture(
          texture,
          tileSize,
          atlasWidth,
          atlasHeight,
        ),
      );
      this.voxels[type] = voxel;
    };

    const CreateVoxelWithTop = (type, sideTexture, topTexture) => {
      if (this.voxels[type] != null) return;

      const voxel = new Voxel(type);
      voxel.SetUVCoordinate(
        VoxelFace.TOP,
        ThreeHelper.GetUVFromSubTexture(
          topTexture,
          tileSize,
          atlasWidth,
          atlasHeight,
        ),
      );

      voxel.SetAllFacesUVCoordinate(
        ThreeHelper.GetUVFromSubTexture(
          sideTexture,
          tileSize,
          atlasWidth,
          atlasHeight,
        ),
        [VoxelFace.TOP],
      );

      this.voxels[type] = voxel;
    };

    CreateVoxel(VoxelType.SAND, sand);
    CreateVoxel(VoxelType.SOIL, dirt);
    CreateVoxel(VoxelType.WATER, water);
    CreateVoxelWithTop(VoxelType.GRASS, grass.side, grass.top);
    CreateVoxelWithTop(VoxelType.SNOW_DIRT, snow.dirt, snow.top);
    CreateVoxelWithTop(VoxelType.SNOW_ROCk, snow.rock, snow.top);
  }
}
