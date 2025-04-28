import MeshFaces from '@/objects/mesh_type/mesh_faces';
import { VoxelFace } from '@/objects/voxel';
import { Terrain } from '@/objects/terrain/terrain';

export default class WaterMesh extends MeshFaces {
  constructor() {
    super();
  }

  BuildMeshFacesAsync(
    coordinate,
    blocks,
    size,
    edge,
    voxelFace,
    material,
    pos,
  ) {
    const x = coordinate.x;
    const y = coordinate.y;
    const z = coordinate.z;

    const PlaceTopMeshFace = (key, face) => {
      const nextVoxelExisted = blocks.has(key);
      const count = Terrain.TERRAIN_CHUNk_LIMIT * Terrain.TERRAIN_CHUNk_LIMIT;
      if (nextVoxelExisted) {
        return;
      }

      pos.makeTranslation(x, z, y);

      const mesh = this.GetMeshFace(face, size, material, count, voxelFace);

      this.UpdateMesh(pos, face, mesh);
    };

    const PlaceMeshFace = (key, face, isAtEdge = false) => {
      const nextVoxelExisted = blocks.has(key);
      const count = Terrain.TERRAIN_CHUNk_LIMIT * Terrain.TERRAIN_CHUNk_HEIGHT;
      if (nextVoxelExisted) {
        return;
      }

      /*
       * Generate face without next voxel existed AND
       * Generate face if the face is not at the edge of chunk
       * */
      if (!nextVoxelExisted && !isAtEdge) {
        pos.makeTranslation(x, z, y);

        const mesh = this.GetMeshFace(face, size, material, count, voxelFace);

        this.UpdateMesh(pos, face, mesh);
      }
    };

    const IsAtEdge = (edge, chunkEdge) => {
      return edge == chunkEdge;
    };

    const nextX = x + size;
    PlaceMeshFace(
      `${nextX},${z},${y}`,
      VoxelFace.RIGHT,
      IsAtEdge(nextX, edge.maxEdge.x),
    );

    const prevX = x - size;
    PlaceMeshFace(
      `${prevX},${z},${y}`,
      VoxelFace.LEFT,
      IsAtEdge(x, edge.minEdge.x),
    );

    const nextZ = z + size;
    PlaceTopMeshFace(`${x},${nextZ},${y}`, VoxelFace.TOP);

    const nextY = y + size;
    PlaceMeshFace(
      `${x},${z},${nextY}`,
      VoxelFace.FRONT,
      IsAtEdge(nextY, edge.maxEdge.y),
    );

    const prevY = y - size;
    PlaceMeshFace(
      `${x},${z},${prevY}`,
      VoxelFace.BACk,
      IsAtEdge(y, edge.minEdge.y),
    );
  }
}
