import { CARD_ATLAS_KEY, CARD_HEIGHT, CARD_WIDTH, CardFactory } from "../Factories/cardFactory";
import { Deck } from "../models/deck";
import { Hand } from "../models/hand";
import { GUTTER_SIZE, textStyle } from "../constants/constants";
import { GameResult } from "../models/gameResult";
import { Button } from "../components/button";

export default class GameScene extends Phaser.Scene {

  constructor() {
    super({
      key: "GameScene"
    });
    this.CARD_FLIP_TIME = 600;
  }

  preload() {
    let cardFactory = new CardFactory(this, '/playingCards.png', '/playingCards.xml');
    this.load.image('cardBack', '/card_back_red.png');
    this.atlasTexture = this.textures.get(CARD_ATLAS_KEY);
    this.betScene = this.scene.get('MainScene');
    // this.load.image('orangeChip', '/chipOrange.png');
    // this.load.image('yellowChip', '/chipYellow.png');
  }

  create() {
    let width = new Number(this.scene.manager.game.config.width).valueOf();
    let height = new Number(this.scene.manager.game.config.height).valueOf();
    this.gameZone = this.add.zone(width * 0.5, height * 0.5, width, height);
    this.setUpMoneyText();
    this.setUpNewGame();

    this.playerHandZone = this.add.zone(0, 0, CARD_WIDTH, CARD_HEIGHT);
    Phaser.Display.Align.To.TopLeft(this.playerHandZone, this.playerScoreText, 0, GUTTER_SIZE);
    this.dealerHandZone = this.add.zone(0, 0, CARD_WIDTH, CARD_HEIGHT);
    Phaser.Display.Align.To.BottomLeft(this.dealerHandZone, this.dealerScoreText, 0, GUTTER_SIZE);
    this.dealInitialCards();
  }

  dealInitialCards() {
    setTimeout(this.handOutCard.bind(this), 1, this.playerHand, false);
    setTimeout(this.handOutCard.bind(this), 500, this.dealerHand, false);
    setTimeout(this.handOutCard.bind(this), 1000, this.playerHand, false);
    setTimeout(this.handOutCard.bind(this), 1500, this.dealerHand, true);
    setTimeout(this.checkForBlackJack.bind(this), 1500);
  }

  checkForBlackJack() {
    const playerHnd = this.playerHand.getBlackjackScore()
    if (playerHnd === 21) {
      this.endHand(GameResult.BLACKJACK)
    }

  }

  createCardTween(image, x, y, duration = 500) {
    this.tweens.add({
      targets: image,
      x: x,
      y: y,
      duration: duration,
      ease: 'Linear'
    });
  }

  flipOverCard(cardBack, cardFront) {
    this.tweens.add({
      targets: cardBack,
      scaleX: 0,
      duration: this.CARD_FLIP_TIME / 2,
      ease: 'Linear'
    });
    this.tweens.add({
      targets: cardFront,
      scaleX: 1,
      duration: this.CARD_FLIP_TIME / 2,
      delay: this.CARD_FLIP_TIME / 2,
      ease: 'Linear'
    });
  }

  setUpMoneyText() {
    this.moneyText = this.add.text(0, 0, '', textStyle);
    this.betText = this.add.text(0, 0, '', textStyle);

    this.updateMoneyText();
    this.updateBetText();
  }

  updateMoneyText() {
    this.moneyText.setText('Money: $' + this.betScene.money);
    Phaser.Display.Align.In.TopRight(this.moneyText, this.gameZone, -20, -20);
  }

  updateBetText() {
    this.betText.setText('Bet: $' + this.betScene.bet);
    Phaser.Display.Align.To.BottomLeft(this.betText, this.moneyText);
  }

  setUpDealerScoreText() {
    this.dealerScoreText = this.add.text(0, 200, '', textStyle);
    this.setDealerScoreText();
    Phaser.Display.Align.In.TopCenter(this.dealerScoreText, this.gameZone, 0, -20);
  }

  setUpPlayerScoreText() {
    this.playerScoreText = this.add.text(0, 300, '', textStyle);
    this.setPlayerScoreText();
    Phaser.Display.Align.In.BottomCenter(this.playerScoreText, this.gameZone, 0, -20);
  }

  setupButtons() {
    this.hitButton = new Button(this, this.gameZone.width - 50, this.gameZone.height * 0.5 - 150, 'Hit', () => this.handleHit())
    this.hitButton.setOrigin(1)
    this.stayButton = new Button(this, this.gameZone.width - 50, this.gameZone.height * 0.5 - 50, 'Stay', () => this.handleStay())
    this.stayButton.setOrigin(1)
    this.DoubleButton = new Button(this, this.gameZone.width - 50, this.gameZone.height * 0.5 + 50, 'Double', () => this.handleDouble())
    this.DoubleButton.setOrigin(1)
    this.surrunderButton = new Button(this, this.gameZone.width - 50, this.gameZone.height * 0.5 + 150, 'Surrender', () => this.handleSurrunder())
    this.surrunderButton.setOrigin(1)
  }


  handleDouble() {
    if (this.betScene.bet * 2 <= this.betScene.money) {
      this.betScene.bet *= 2
      this.updateBetText(this.betScene);
      this.handleHit()
      setTimeout(() => {
        this.handleStay()
      }, 1500);
      this.hitButton.disableInteractive();
      this.surrunderButton.disableInteractive();
    }
  }

  handleSurrunder() {
    this.endHand(GameResult.SURRENDER)
  }


  setUpNewGame() {
    this.deck = new Deck();
    this.dealerHand = new Hand();
    this.playerHand = new Hand();
    this.setupButtons()
    this.setUpDealerScoreText();
    this.setUpPlayerScoreText();
  }


  handleHit() {
    this.handOutCard(this.playerHand, false);
    this.setPlayerScoreText();
    if (this.playerHand.getBlackjackScore() > 21) {
      this.endHand(GameResult.BUST);
    }
  }

  handleStay() {
    this.handleFlipOver();
    setTimeout(() => {
      this.drawCardsUntil17();
    }, this.CARD_FLIP_TIME);
  }

  drawCardsUntil17() {
    let dealerScore = this.dealerHand.getBlackjackScore();
    let playerScore = this.playerHand.getBlackjackScore();
    let result = null;
    if (dealerScore < 17) {
      this.handOutCard(this.dealerHand, false)
      setTimeout(() => {
        this.drawCardsUntil17()
      }, 500);
      return;
    }
    result = this.deriveGameResult(dealerScore, playerScore, result);
    this.endHand(result)
    // setTimeout(mainScene.endHand.bind(mainScene), 500, result);
  }


  deriveGameResult(dealerScore, playerScore, result) {
    if (dealerScore > 21 || (playerScore < 22 && playerScore > dealerScore)) {
      result = GameResult.WIN;
    }
    else if (dealerScore === playerScore) {
      result = GameResult.PUSH;
    }
    else {
      result = GameResult.LOSS;
    }
    return result;
  }

  handleFlipOver() {
    this.dealerHand.getCards().forEach(card => {
      if (card.getFaceDown()) {
        card.setFaceDown(false);
        let cardFront = this.add.image(this.faceDownImage.x, this.faceDownImage.y, CARD_ATLAS_KEY, card.getAtlasFrame());
        cardFront.setScale(0, 1);
        this.flipOverCard(this.faceDownImage, cardFront);
      }
    });
    this.setDealerScoreText();
  }

  handOutCard(hand, faceDownCard) {
    let card = this.deck.drawCard();
    let cardImage;
    if (!faceDownCard) {
      hand.receiveCard(card);
      cardImage = this.add.image(0, 0, CARD_ATLAS_KEY, card.getAtlasFrame());
    }
    else {
      hand.receiveCardFaceDown(card);
      cardImage = this.add.image(0, 0, 'cardBack');
      this.faceDownImage = cardImage;
    }
    let xOffset = (hand.getCards().length - 1) * 50;
    if (hand === this.playerHand) {
      this.createCardTween(cardImage, this.playerHandZone.x + xOffset, this.playerHandZone.y);
      this.setPlayerScoreText()
    }
    else {
      this.createCardTween(cardImage, this.dealerHandZone.x + xOffset, this.dealerHandZone.y, 350);
      this.setDealerScoreText();
    }
  }

  setDealerScoreText() {
    setTimeout(() => {
      this.dealerScoreText.setText(this.dealerHand.getBlackjackScore());
      this.dealerScoreText.x += 20
    }, 500);

  }

  setPlayerScoreText() {
    setTimeout(() => {

      this.playerScoreText.setText(this.playerHand.getBlackjackScore());
      this.playerScoreText.x += 20
    }, 500);
  }

  endHand(result) {
    setTimeout(() => {
      this.hitButton.disableInteractive();
      this.stayButton.disableInteractive();
      this.payout(result);
      let graphics = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.9 } });
      let square = new Phaser.Geom.Rectangle(0, 0, new Number(this.scene.manager.game.config.width).valueOf(),
        new Number(this.scene.manager.game.config.height).valueOf());
      graphics.fillRectShape(square);
      let resultText = this.add.text(0, 0, result, textStyle);
      resultText.setColor("#ffde3d");
      const again = new Button(this, 0, 0, 'Again', () => this.scene.start('MainScene'))
      Phaser.Display.Align.In.Center(resultText, this.gameZone);
      Phaser.Display.Align.In.Center(again, this.gameZone, 0, 100);
    }, this.CARD_FLIP_TIME);
  }

  payout(result) {
    switch (result) {
      case GameResult.WIN:
        this.betScene.money += this.betScene.bet;
        break;
      case GameResult.LOSS:
        this.betScene.money -= this.betScene.bet;
        break;
      case GameResult.PUSH:
        // no change here
        break;
      case GameResult.BLACKJACK:
        this.betScene.money += Math.floor(this.betScene.bet * 1.5);
        break;
      case GameResult.SURRENDER:
        this.betScene.money -= Math.floor(this.betScene.bet * 0.5);
        break;
      case GameResult.BUST:
        this.betScene.money -= this.betScene.bet;
        break;
      default:
        break;
    }

    this.updateMoneyText();
  }
}