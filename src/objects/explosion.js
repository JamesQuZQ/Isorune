import { Sprite, SpriteMaterial, TextureLoader } from "three";

const SPRITE_CHANGE_INTERVAL = 0.02;

export class Explosion extends Sprite {
    constructor(position, app) {
        const textureLoader = new TextureLoader();
        const material = new SpriteMaterial({
            map: textureLoader.load('src/assets/explosion/explosion0001.png'),
            transparent: true,
        });

        super(material);

        this.textureLoader = textureLoader;
        this.position.copy(position);
        this.scale.set(1, 1, 1);

        this.app = app;
        this.pngNum = 1;
        this.count = 0;
    }

    Tick(delta) {
        this.count += delta;
        if (this.count >= SPRITE_CHANGE_INTERVAL){
            this.count = 0;
            this.pngNum ++;
            if (this.pngNum > 60){
                this.app.DisposeObject(this);
            } else {
                const png = 'src/assets/explosion/explosion00' + (this.pngNum >= 10 ? '' : '0') + this.pngNum.toString() + '.png';
                this.textureLoader.load(png, (newTexture) => {
                this.material.map = newTexture;
                this.material.needsUpdate = true; // Important to reflect changes
                });
            }
        }
    }
}
