import { textStyle } from "../constants/constants";

const chipsStyle = {
  font: "normal 32px Impact",
  bg: '#ffffff20',
  bgHover: '#ffffff40',
  color: '#fff'
};



export class Chip {
  constructor(scene, image, value, callBack) {
    const scale = 1

    const chip = scene.add.image(0, 0, image).setScale(scale);
    chip.setInteractive();
    chip.setDataEnabled();
    chip.data.set("value", value);
    Phaser.Display.Align.In.Center(chip, scene.gameZone, 0, 0);
    const text = scene.add.text(0, 0, value, textStyle);
    text.setOrigin(0.5)
    Phaser.Display.Align.In.Center(text, chip);
    // text.setDepth(1);
    const group = scene.add.group();
    group.add(chip)
    group.add(text)
    chip.on(
      "pointerdown",
      function () {
        callBack(value);
      },
      this
    );
    chip.on(
      "pointerover",
      function () {
        scene.tweens.add({
          targets: chip,
          duration: 100,
          scale: scale * 1.1,
          ease: 'Linear'
        });
        scene.tweens.add({
          targets: text,
          duration: 100,
          scale: scale * 1.1,
          ease: 'Linear'
        });
        // chip.setScale(scale * 1.1);
      },
      this
    );
    chip.on(
      "pointerout",
      function () {
        // chip.setScale(scale);
        scene.tweens.add({
          targets: chip,
          duration: 100,
          scale: scale,
          ease: 'Linear'
        });
        scene.tweens.add({
          targets: text,
          duration: 100,
          scale: scale,
          ease: 'Linear'
        });
      },
      this
    );
    return group
  }

}