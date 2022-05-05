
export class TextUtility {
  static centerTextHorizontally(text, scene) {
    text.setX(new Number(scene.manager.game.config.width).valueOf() * 0.5 - (text.displayWidth * 0.5));
  }

  static centerTextOnImageHorizontally(text, image) {
    let centerX = image.x;
    text.setX(image.x - (text.displayWidth * 0.5))
  }

  static spaceOutImagesEvenlyHorizontally(texts, scene) {
    for (let i = 0; i < texts.length; i++) {
      //we want to space out the images so there's even spaces on all sides
      //this means dividing the screen into one more division then we have imsages
      //and then placing the center of the images on the 1st division to the 2nd to last
      texts[i].setX(new Number(scene.manager.game.config.width).valueOf() * (i + 1) / (texts.length + 1));
    }
  }
}