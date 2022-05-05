import { Button } from "../components/button";
import { Chip } from "../components/chips";
import { HIGH_SCORE_STORAGE, textStyle } from "../constants/constants";
import { ImageUtility } from "../utility/ImageUtility";



export default class MainScene extends Phaser.Scene {

  constructor() {
    super("MainScene");
    this.money = 1000;
    this.bet = 0
    this.effectDuration = 300;
  }

  preload() {
    // load chips
    this.load.image('redChip', '/chipRed.png');
    this.load.image('whiteChip', '/chipWhite.png');
    this.load.image('blueChip', '/chipBlue.png');
    this.load.image('orangeChip', '/chipOrange.png');
    this.load.image('yellowChip', '/chipYellow.png');
  }

  create() {
    if (this.money == 0) return this.gameOver();
    this.scale = 1;
    this.width = this.sys.canvas.width
    this.height = this.sys.canvas.height
    this.betArea = this.add.rectangle(this.width / 2, 250, 250, 100);
    this.gameZone = this.add.zone(this.width * 0.5, this.height * 0.5, this.width, this.height);
    this.betArea.setStrokeStyle(2, 0xa2a2a2);
    this.setUpTitle()
    this.setUpText();
    this.setUpButtons()
  }

  setUpTitle() {
    this.textTitle = this.add.text(0, 20, 'Place your bet', textStyle);
    Phaser.Display.Align.In.Center(
      this.textTitle,
      this.betArea,
      0,
      -(100)
    );
  }

  setUpText() {
    this.moneyText = this.add.text(0, 0, "", textStyle);
    this.betText = this.add.text(0, 0, "", textStyle);
    this.updateMoneyText();
    this.updateBetText();
  }

  updateMoneyText() {
    this.moneyText.setText("Money: $" + this.money);
    Phaser.Display.Align.In.TopRight(this.moneyText, this.gameZone, -20, -20);
  }

  updateBetText() {
    this.betText.setText("Bet: $" + this.bet);
    Phaser.Display.Align.In.Center(this.betText, this.betArea);
  }

  setUpButtons() {
    let whiteChip = new Chip(this, 'whiteChip', 1, this.addChip.bind(this))
    let blueChip = new Chip(this, 'blueChip', 10, this.addChip.bind(this))
    let redChip = new Chip(this, 'redChip', 25, this.addChip.bind(this))
    let yellowChip = new Chip(this, 'yellowChip', 50, this.addChip.bind(this))
    let orangeChip = new Chip(this, 'orangeChip', 100, this.addChip.bind(this))

    this.chips = new Array();
    this.chips.push(whiteChip, blueChip, redChip, yellowChip, orangeChip);


    this.clearButton = new Button(this, 100, 100, 'Clear', () => {
      this.bet = 0;
      this.dealButton.disableInteractive()
      this.updateBetText();
    })
    this.dealButton = new Button(this, 100, 100, 'Deal', () => {
      if (this.bet) {
        this.cleanSceneByEffect()
        setTimeout(() => {
          this.scene.start("GameScene");
        }, this.effectDuration + 200);
      }
    })
    if (this.bet === 0) {

      this.dealButton.disableInteractive()
    }

    Phaser.Display.Align.In.BottomCenter(
      this.clearButton,
      this.gameZone,
      0,
      -(40 * this.scale)
    );
    Phaser.Display.Align.In.BottomCenter(
      this.dealButton,
      this.gameZone,
      0,
      -(40 * this.scale)
    );

    let buttons = new Array();
    buttons.push(this.clearButton);
    buttons.push(this.dealButton);
    ImageUtility.spaceOutImagesEvenlyHorizontally(buttons, this.scene);
    ImageUtility.spaceOutImagesEvenlyHorizontally(this.chips, this.scene);

  }

  cleanSceneByEffect() {
    this.chips.forEach((chip) => {
      this.tweens.add({
        targets: chip.getChildren(),
        duration: this.effectDuration,
        y: this.height + 100,
        ease: 'Linear'
      });
    })
    this.tweens.add({
      targets: this.dealButton,
      duration: this.effectDuration,
      y: this.height + 100,
      ease: 'Linear'
    });
    this.tweens.add({
      targets: this.clearButton,
      duration: this.effectDuration,
      y: this.height + 100,
      ease: 'Linear'
    });
    this.tweens.add({
      targets: this.betArea,
      duration: this.effectDuration,
      y: -100,
      ease: 'Linear'
    });
    this.tweens.add({
      targets: this.textTitle,
      duration: this.effectDuration,
      y: -100,
      ease: 'Linear'
    });
    this.tweens.add({
      targets: this.betText,
      duration: this.effectDuration,
      y: -100,
      ease: 'Linear'
    });
  }


  addChip(value) {
    this.dealButton.setInteractive()

    if (this.bet + value <= this.money) {
      this.bet += value;
      this.updateBetText();
    }
  }

  gameOver() {
    let graphics = this.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.75 },
    });
    let square = new Phaser.Geom.Rectangle(
      0,
      0,
      new Number(this.scene.manager.game.config.width).valueOf(),
      new Number(this.scene.manager.game.config.height).valueOf()
    );
    graphics.fillRectShape(square);
    let resultText = this.add.text(
      0,
      0,
      "Gave Over, you have no money anymore :(",
      textStyle
    );
    resultText.setColor("#ffde3d");
    const again = new Button(this, 0, 0, 'Restart', () => {
      this.money = 1000;
      this.bet = 0;
      this.scene.restart();
    })
    Phaser.Display.Align.In.Center(resultText, this.gameZone);
    Phaser.Display.Align.In.Center(again, this.gameZone, 0, 100);
  }

}
