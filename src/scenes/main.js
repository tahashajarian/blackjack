import { Button } from "../components/button";
import { Chip } from "../components/chips";
import { COLORS, textStyle } from "../constants/constants";
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
    if (this.money <= 0) return this.gameOver();
    this.scale = 1;
    this.width = this.sys.canvas.width
    this.height = this.sys.canvas.height
    this.drawTable();
    this.betArea = this.add.rectangle(this.width / 2, 330, 430, 150, COLORS.panel, 0.82);
    this.gameZone = this.add.zone(this.width * 0.5, this.height * 0.5, this.width, this.height);
    this.betArea.setStrokeStyle(3, COLORS.gold, 0.85);
    this.setUpTitle()
    this.setUpText();
    this.setUpButtons()
  }

  drawTable() {
    const g = this.add.graphics();
    g.fillGradientStyle(COLORS.feltLight, COLORS.feltLight, COLORS.felt, COLORS.felt, 1);
    g.fillRect(0, 0, this.width, this.height);
    g.lineStyle(5, COLORS.gold, 0.28);
    g.strokeEllipse(this.width / 2, 570, 1500, 780);
    g.lineStyle(2, 0xffffff, 0.09);
    g.strokeEllipse(this.width / 2, 570, 1450, 730);
    this.add.text(this.width / 2, 78, 'BLACKJACK', { ...textStyle, fontSize: '72px', color: '#f5c451', letterSpacing: 12 }).setOrigin(0.5);
    this.add.text(this.width / 2, 145, 'ROYALE  •  PAYS 3 TO 2', { ...textStyle, fontSize: '21px', color: '#fff5d6', letterSpacing: 5 }).setOrigin(0.5).setAlpha(0.8);
  }

  setUpTitle() {
    this.textTitle = this.add.text(0, 20, 'PLACE YOUR BET', { ...textStyle, fontSize: '28px', color: '#fff5d6', letterSpacing: 3 });
    Phaser.Display.Align.In.Center(
      this.textTitle,
      this.betArea,
      0,
      -(120)
    );
  }

  setUpText() {
    this.moneyText = this.add.text(0, 0, "", textStyle);
    this.betText = this.add.text(0, 0, "", textStyle);
    this.updateMoneyText();
    this.updateBetText();
  }

  updateMoneyText() {
    this.moneyText.setText("BANK  $" + this.money);
    this.moneyText.setStyle({ ...textStyle, fontSize: '30px', color: '#fff5d6', backgroundColor: '#062b21cc', padding: { x: 22, y: 14 } });
    Phaser.Display.Align.In.TopRight(this.moneyText, this.gameZone, -40, -35);
  }

  updateBetText() {
    this.betText.setText("$" + this.bet);
    this.betText.setStyle({ ...textStyle, fontSize: '54px', color: '#f5c451' });
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
    this.dealButton.disableInteractive()

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
    if (this.bet + value <= this.money) {
      this.bet += value;
      this.updateBetText();
      this.dealButton.setInteractive()
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
      "GAME OVER",
      textStyle
    );
    resultText.setColor("#ffde3d");
    const detailText = this.add.text(0, 0, 'Your bankroll is empty. Ready for another run?', { ...textStyle, fontSize: '26px' });
    const again = new Button(this, 0, 0, 'Restart', () => {
      this.money = 1000;
      this.bet = 0;
      this.scene.restart();
    })
    Phaser.Display.Align.In.Center(resultText, this.gameZone);
    Phaser.Display.Align.In.Center(detailText, this.gameZone, 0, 60);
    Phaser.Display.Align.In.Center(again, this.gameZone, 0, 150);
  }

}
