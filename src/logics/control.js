import { Vector3, Vector2 } from 'three';
import { Terrain } from '@/objects/terrain/terrain';
import VectorHelper from '@/utils/vector_helper';
import { Chunk } from '@/objects/terrain/chunk';

/**@import { App } from '@/core/app';*/
/** @import { Character } from '@/objects/character/character';*/

/**
 * @property {Terrain} terrain - paramDescription
 * @property {Character} character - paramDescription
 * */
export class ControlService {
  /**
   * @param {Terrain} terrain - paramDescription
   * @param {Character} character - paramDescription
   * @param {App} app - paramDescription
   * */
  constructor(terrain, character, app) {
    this.terrain = terrain;
    this.character = character;
    this.app = app;

    this.character.mesh.matrixAutoUpdate = true;
    this.keyMap = {};

    const onDocumentKey = (e) => {
      this.keyMap[e.code] = e.type === 'keydown';
    };

    document.addEventListener('keydown', onDocumentKey, false);
    document.addEventListener('keyup', onDocumentKey, false);

    this.lastPost = new Vector3().clone(this.character.mesh.position);
    this.viewedChunkCoordinate = new Vector2();
    this.viewable = new Set();
  }

  async Tick(delta) {
    if (this.keyMap['KeyW'] || this.keyMap['ArrowUp']) {
      this.character.mesh.translateZ(delta * 25);
    }

    if (this.keyMap['KeyS'] || this.keyMap['ArrowDown']) {
      this.character.mesh.translateZ(-delta * 25);
    }

    if (this.keyMap['KeyD'] || this.keyMap['ArrowLeft']) {
      this.character.mesh.translateX(-delta * 25);
    }

    if (this.keyMap['KeyA'] || this.keyMap['ArrowRight']) {
      this.character.mesh.translateX(delta * 25);
    }

    const charPos = new Vector3().copy(this.character.mesh.position);
    const viewDistance = 3;
    const currentChunkXCharOn = Math.round(charPos.x / Terrain.TERRAIN_CHUNk_LIMIT);
    const currentChunkYCharOn = Math.round(charPos.z / Terrain.TERRAIN_CHUNk_LIMIT);

    // console.log(currentChunkCoordinate);
    /* NOTE:
     * Only Render when character move
     * when character moved out of the current chunk bound =>
     * then render new terrain (better performance since we don't render on every move)
     *
     * TODO:
     * Queue dispose invisible chunk function in a worker thread
     * */
    // Only Render new terrain if character move

    if (VectorHelper.Tokey3(this.lastPost) != VectorHelper.Tokey3(charPos) || this.app.state == 0) {
      const vec2 = new Vector2();
      for (let x = -viewDistance; x <= viewDistance; x++) {
        for (let z = -viewDistance; z <= viewDistance; z++) {
          this.viewable.add(VectorHelper.Tokey2(vec2.set(x + currentChunkXCharOn, z + currentChunkYCharOn)));
          this.viewedChunkCoordinate.set(x + currentChunkXCharOn, z + currentChunkYCharOn);

          if (this.terrain.chunks.has(VectorHelper.Tokey2(this.viewedChunkCoordinate))) {
            const chunk = this.terrain.chunks.get(VectorHelper.Tokey2(this.viewedChunkCoordinate));
          } else {
            await this.terrain.AppendChunkAsync(this.viewedChunkCoordinate, 4, (object) => this.app.AddAsync(object.group));
          }
        }
      }

      for (const chunk of this.terrain.chunks.values()) {
        if (!this.viewable.has(VectorHelper.Tokey2(chunk.edge))) this.terrain.DisposeChunk(chunk, (object) => this.app.DisposeMesh(object.group));
        this.viewable.delete(VectorHelper.Tokey2(chunk.edge));
      }

      this.app.state = 1;
    }

    this.lastPost.copy(this.character.mesh.position);
  }
}
