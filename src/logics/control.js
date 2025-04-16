import { Terrain } from '@/objects/terrain/terrain';
import { Vector2, Vector3 } from '@/utils/vector_helper';
import { Chunk } from '@/objects/terrain/chunk';

/**@import { App } from '@/core/app';*/
/** @import { Character } from '@/objects/character/character';*/

export default class ControlService {
  static DISPOSE_CHUNk_THRESHOLD = Terrain.TERRAIN_CHUNk_LIMIT * 5;
  static VIEW_DISTANCE = 1;
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

    this.lastChunkCoordinate = new Vector2(0, 0);

    this.vec2Pool = new Vector2();
  }

  get characterPosition2() {
    return new Vector2(this.characterPosition.x, this.characterPosition.z);
  }

  get characterPosition() {
    return new Vector3().copy(this.character.mesh.position);
  }

  get currentChunkXCharOn() {
    return Math.round(this.characterPosition.x / Terrain.TERRAIN_CHUNk_LIMIT);
  }

  get currentChunkYCharOn() {
    return Math.round(this.characterPosition.z / Terrain.TERRAIN_CHUNk_LIMIT);
  }

  get currentChunkCoordinate() {
    return new Vector2(this.currentChunkXCharOn, this.currentChunkYCharOn);
  }

  addChunkToApp = (object) => this.app.AddObject(object);
  removeChunkFromApp = (object) => this.app.DisposeObject(object);

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

    if (
      this.lastPost.Tokey() != this.characterPosition2.Tokey() ||
      this.app.state == 0
    ) {
      await this.CreateTerrainChunkOnCharacterPosition(
        this.addChunkToApp,
        this.removeChunkFromApp,
      );

      // this.UpdateTerrainOnCharacterPosition(this.removeChunkFromApp);

      this.app.state = 1;
    }

    this.lastChunkCoordinate.copy(this.currentChunkCoordinate);
    this.lastPost.copy(this.character.mesh.position);
  }

  async CreateTerrainChunkOnCharacterPosition() {
    for (
      let x = -ControlService.VIEW_DISTANCE;
      x <= ControlService.VIEW_DISTANCE;
      x++
    ) {
      for (
        let z = -ControlService.VIEW_DISTANCE;
        z <= ControlService.VIEW_DISTANCE;
        z++
      ) {
        const xOff = x + this.currentChunkXCharOn;
        const yOff = z + this.currentChunkYCharOn;
        this.viewable.add(this.vec2Pool.set(xOff, yOff).Tokey());
        this.viewedChunkCoordinate.set(xOff, yOff);

        /** @type {Chunk} chunk*/
        const chunk = this.terrain.chunks.get(
          this.viewedChunkCoordinate.Tokey(),
        );
        if (chunk) {
          const isCenterChunk =
            chunk.coordinate.Tokey() == this.currentChunkCoordinate.Tokey();
          if (
            isCenterChunk &&
            chunk.coordinate.Tokey() != this.lastChunkCoordinate.Tokey()
          ) {
            console.log('moved out of the center chunk');
            this.terrain.RenderChunks(this.addChunkToApp);
          }
        } else {
          await this.terrain.AppendChunkAsync(this.viewedChunkCoordinate, 4);
        }
      }
    }
  }

  /**
   * Check the distance of the nearest edge of the chunk with
   * character position if exceeded the Threshold then dispose it
   *
   * @param {Function} removeChunkFromApp
   * */
  UpdateTerrainOnCharacterPosition() {
    if (!this.terrain.chunks) return;
    // for (const chunk of this.terrain.chunks.values()) {
    //   console.log(this.terrain.chunks);
    //   if (this.viewable.has(chunk.coordinate.Tokey())) {
    //     if (
    //       this.characterPosition2.distanceTo(chunk.edge) >=
    //       ControlService.DISPOSE_CHUNk_THRESHOLD
    //     ) {
    //       // this.terrain.DisposeChunk(chunk, this.removeChunkFromApp);
    //     } else {
    //       chunk.Hide();
    //     }
    //   }
    //
    //   this.viewable.delete(chunk.coordinate.Tokey());
    // }
  }
}
