import { Terrain } from '@/objects/terrain/terrain';
import { Vector2, Vector3 } from '@/utils/vector_helper';
import { Chunk } from '@/objects/terrain/chunk';

/**@import { App } from '@/core/app';*/
/** @import { Character } from '@/objects/character/character';*/

/**
 * @property {Terrain} terrain - paramDescription
 * @property {Character} character - paramDescription
 * */
export class ControlService {
  static DISPOSE_CHUNk_THRESHOLD = 300;
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
    this.viewPoolSize = 12;
  }

  async Tick(delta) {
    const addChunkToApp = (object) => this.app.AddAsync(object.group);
    const removeChunkFromApp = (object) => this.app.DisposeObject(object.group);

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
    const viewDistance = 1;
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

    const charPos2 = new Vector2(charPos.x, charPos.z);

    const getLOD = (chunkEdge) => {
      if (charPos2.distanceTo(chunkEdge) > 20) return 5;
      else if (charPos2.distanceTo(chunkEdge) > 50) return 6;
      else return 4;
    };

    if (this.lastPost.Tokey() != charPos.Tokey() || this.app.state == 0) {
      /**
       * Check the distance of the nearest edge of the chunk with
       * character position if exceeded the Threshold then dispose it
       * */
      for (const chunk of this.terrain.chunks.values()) {
        if (!this.viewable.has(chunk.coordinate.Tokey())) {
          if (charPos2.distanceTo(chunk.edge) >= ControlService.DISPOSE_CHUNk_THRESHOLD) {
            this.terrain.DisposeChunk(chunk, removeChunkFromApp);
          } else {
            chunk.Hide();
          }
        } else {
          chunk.Show();
        }

        this.viewable.delete(chunk.coordinate.Tokey());
      }

      const vec2 = new Vector2();
      for (let x = -viewDistance; x <= viewDistance; x++) {
        for (let z = -viewDistance; z <= viewDistance; z++) {
          this.viewable.add(vec2.set(x + currentChunkXCharOn, z + currentChunkYCharOn).Tokey());
          this.viewedChunkCoordinate.set(x + currentChunkXCharOn, z + currentChunkYCharOn);

          if (this.terrain.chunks.has(this.viewedChunkCoordinate.Tokey())) {
          } else {
            await this.terrain.AppendChunkAsync(this.viewedChunkCoordinate, 4, addChunkToApp);
          }
        }
      }

      this.app.state = 1;
    }

    this.lastPost.copy(this.character.mesh.position);
  }
}
