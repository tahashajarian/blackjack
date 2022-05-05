import Phaser from "phaser";
import MainScene from "./scenes/main";
import GameScene from './scenes/game';

const game = new Phaser.Game({
  width: 1920,
  height: 1080,
  backgroundColor: "#205436",
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  },
  scene: [MainScene, GameScene],
});

game.scene.start("Main");
