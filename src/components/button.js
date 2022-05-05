const buttonStyle = {
  font: "normal 36px Impact",
  bg: '#ffffff20',
  bgHover: '#ffffff40',
  color: '#fff',
  bgActive: '#ffffff60'
};



export class Button {
  constructor(scene, x, y, label, callback) {
    const button = scene.add.text(x, y, label)
      .setOrigin(0.5)
      .setPadding(30, 10)
      .setStyle({ backgroundColor: buttonStyle.bg, font: buttonStyle.font, fixedWidth: '200', align: 'center' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        callback();
        button.setStyle({ backgroundColor: buttonStyle.bgActive })
      })
      .on('pointerup', () => {
        button.setStyle({ backgroundColor: buttonStyle.bgHover })
      })
      .on('pointerover', () => button.setStyle({ backgroundColor: buttonStyle.bgHover }))
      .on('pointerout', () => button.setStyle({ backgroundColor: buttonStyle.bg }));
    return button
  }

}