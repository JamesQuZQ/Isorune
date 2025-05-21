import { Vector3 } from "three";


export class ProjectileControl {

    constructor(app) {
        this.app = app;
        this.projectiles = [];
    }

    addProjectile(obj){
        this.projectiles.push(obj)
    }

    async generatePlayerMissile(){
        await this.app.projectileFactory.createMissile(1, this.app.player.position, this.app.player.speed * 3);
        // await this.app.projectileFactory.createMissile(1, this.app.player.position, 0);
    }

    async generatePlayerBomb(){
        await this.app.projectileFactory.createBomb(1, this.app.player.position, this.app.player.speed * 2);
        // await this.app.projectileFactory.createMissile(1, this.app.player.position, 0);
    }

    async generatePlayerMachineGunBullet(){
        if (this.app.player.bulletNum > 0){
            this.app.player.bulletNum --;
            await this.app.projectileFactory.createMachineGunBullet(this.app.player.position, this.app.player.speed + 0.02, this.app.player.rotation);
        }
    }

    async Tick(delta) {
    }

    getRandomSpawnPosition(){
        return new Vector3(Math.random() * 2 - 1, 40, Math.random() * 5 + 1);
    }
}