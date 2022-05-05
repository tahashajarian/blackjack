import { Card } from "./card";

export class Deck {

  constructor() {
    this.resetShuffleDeck();
  }

  resetShuffleDeck() {
    this.cards = new Array();
    this.createFullUnshuffledDeck();
    this.shuffleDeck();
  }

  drawCard() {
    return this.cards.pop();
  }

  getDeckSize() {
    return this.cards.length;
  }

  createFullUnshuffledDeck() {
    this.constructSuit('Clubs');
    this.constructSuit('Diamonds');
    this.constructSuit('Hearts');
    this.constructSuit('Spades');
  }

  constructSuit(suit) {
    this.cards.push(new Card(suit, '2'));
    this.cards.push(new Card(suit, '3'));
    this.cards.push(new Card(suit, '4'));
    this.cards.push(new Card(suit, '5'));
    this.cards.push(new Card(suit, '6'));
    this.cards.push(new Card(suit, '7'));
    this.cards.push(new Card(suit, '8'));
    this.cards.push(new Card(suit, '9'));
    this.cards.push(new Card(suit, '10'));
    this.cards.push(new Card(suit, 'J'));
    this.cards.push(new Card(suit, 'Q'));
    this.cards.push(new Card(suit, 'K'));
    this.cards.push(new Card(suit, 'A'));
  }

  shuffleDeck() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      let temp = this.cards[i];
      this.cards[i] = this.cards[j];
      this.cards[j] = temp;
    }
  }
}
