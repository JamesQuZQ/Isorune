import { Vector3 } from "three";


const MAX_PLANE_NUM = 3;

export class PlaneControl {
    
    constructor(app) {
        this.planes = [];
        this.app = app
    }

    async generatePlane(){
        await this.app.planeFactory.createPlane(this.getRandomSpawnPosition());
    }

    async Tick(delta) {

    }

    getRandomSpawnPosition(){
        return new Vector3(Math.random() * 5 + 1, 40, Math.random() * 2 - 1);
    }
}