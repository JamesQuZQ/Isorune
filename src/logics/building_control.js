import { Vector3 } from "three";
import { BlockType } from "@/objects/blocks";

const MAX_BUILDINGS_PER_CHUNK = 15; // Reduced number of buildings to avoid crowding
const MIN_DISTANCE_BETWEEN_BUILDINGS = 25; // Increased distance for better spacing

export class BuildingControl {
  constructor(app) {
    this.buildings = [];
    this.app = app;
    this.placedPositions = new Set(); // Keep track of positions where buildings have been placed
  }

  /**
   * Initialize buildings on terrain soil blocks
   * @param {Object} terrain The terrain object
   */
  initializeBuildings(terrain) {
    console.log("Starting building initialization...");

    // Get soil blocks that are exposed on top but surrounded by soil on sides
    const soilBlocks = terrain.getSoilBlocksForBuildings(4); // Use LOD 4

    if (!soilBlocks || soilBlocks.length === 0) {
      console.error("No suitable soil blocks found for buildings");
      return;
    }

    console.log(
      `Found ${soilBlocks.length} suitable soil blocks for potential building placement`
    );

    // Convert the soil blocks to Vector3 positions with position on top of the soil block
    const buildingPositions = soilBlocks.map(
      (block) =>
        // Increased height to avoid clipping issues
        new Vector3(block.position.x, block.position.y + 4, block.position.z)
    );

    // Randomly select some positions to place buildings
    const shuffledPositions = this.shuffleArray(buildingPositions);

    // Take a sample of soil blocks
    const selectedPositions = shuffledPositions.slice(
      0,
      MAX_BUILDINGS_PER_CHUNK * 3
    );

    console.log(
      `Selected ${selectedPositions.length} random positions for building placement`
    );

    let buildingCount = 0;

    // Place buildings at selected positions
    for (const position of selectedPositions) {
      // Check if we're too close to another building
      if (!this.isTooCloseToExistingBuilding(position)) {
        console.log(
          `Creating building at position: ${position.x}, ${position.y}, ${position.z}`
        );

        // Call the building factory to create a building
        this.app.buildingFactory.createBuilding(position);

        // Track this position
        this.placedPositions.add(`${position.x},${position.y},${position.z}`);
        buildingCount++;

        // Limit the number of buildings
        if (buildingCount >= MAX_BUILDINGS_PER_CHUNK) {
          console.log(
            `Reached maximum building count (${MAX_BUILDINGS_PER_CHUNK})`
          );
          break;
        }
      }
    }

    console.log(`Initiated placement of ${buildingCount} buildings`);
  }

  /**
   * Check if a position is too close to existing buildings
   * @param {Vector3} position The position to check
   * @returns {boolean} True if the position is too close to existing buildings
   */
  isTooCloseToExistingBuilding(position) {
    // Check if we're too close to an existing building position
    for (const posKey of this.placedPositions) {
      const [x, y, z] = posKey.split(",").map(Number);
      const existingPos = new Vector3(x, y, z);

      if (position.distanceTo(existingPos) < MIN_DISTANCE_BETWEEN_BUILDINGS) {
        return true;
      }
    }

    return false;
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param {Array} array The array to shuffle
   * @returns {Array} The shuffled array
   */
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  }

  /**
   * Tick method required for the game loop
   * @param {number} delta Time since last update
   */
  Tick(delta) {
    // Buildings don't need to be updated every frame
  }
}
