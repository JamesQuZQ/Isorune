/** @import { Vector2 } from "three";*/

/** Static Class
 *
 * */
export default class VectorHelper {
  /**
   * @param {Vector2} vector
   *
   * @return {string}
   * */
  static Tokey2(vector) {
    return `${vector.x == -0 ? 0 : vector.x},${vector.y == -0 ? 0 : vector.y}`;
  }

  /**
   * @param {Vector3} vector
   *
   * @return {string}
   * */
  static Tokey3(vector) {
    return `${vector.x},${vector.y},${vector.z}`;
  }
}
