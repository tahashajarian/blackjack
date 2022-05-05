
export class Card {


  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  getSuit() {
    return this.suit;
  }

  getValue() {
    return !this.faceDown ? this.value : "0";
  }

  getAtlasFrame() {
    return !this.faceDown ? 'card' + this.suit + this.value + '.png' : "";
  }

  setFaceDown(faceDown) {
    this.faceDown = faceDown;
  }

  getFaceDown() {
    return this.faceDown;
  }
}
