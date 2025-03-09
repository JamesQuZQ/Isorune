import { TextureLoader, SRGBColorSpace } from 'three';

export class LoaderHelper {
  static LoadTexture(file) {
    if (!file) {
      Error('texture file does not exist');
    }

    return new TextureLoader().load(file, (texture) => {
      texture.colorSpace = SRGBColorSpace;
    });
  }
}
