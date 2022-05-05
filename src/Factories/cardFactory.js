

export const CARD_ATLAS_KEY = 'cards';
export const CARD_HEIGHT = 190;
export const CARD_WIDTH = 140;

export class CardFactory {

  constructor(scene,textureUrl,atlasUrl){
    scene.load.atlasXML(CARD_ATLAS_KEY,textureUrl,atlasUrl);
  }
}
