import { Card } from "./card";

export class Hand {

  constructor() {
    this.emptyHand();
  }

  receiveCard(card) {
    this.cards.push(card);
  }

  receiveCardFaceDown(card) {
    card.setFaceDown(true);
    this.cards.push(card);
  }

  emptyHand() {
    this.cards = [];
  }

  getBlackjackScore() {
    let score = 0;
    let aces = 0;
    let faceCards = ['J', 'Q', 'K'];
    let ace = 'A';
    this.cards.forEach(function (card) {
      let value = card.getValue();
      if (faceCards.includes(value)) score += 10;
      else if (ace === value) aces++;
      else score += Number(value);
    });
    for (let i = 0; i < aces; i++) {
      if (score + 11 > 21) score += 1;
      else score += 11;
    }
    return score;
  }

  getCards() {
    return this.cards;
  }
}