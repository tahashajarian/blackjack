const buttonStyle = {
  font: "bold 30px Arial",
  bg: '#f5c451',
  bgHover: '#ffda73',
  color: '#fff',
  bgActive: '#dba936',
  disabled: '#53625c'
};



export class Button {
  constructor(scene, x, y, label, callback) {
    const button = scene.add.text(x, y, label)
      .setOrigin(0.5)
      .setPadding(24, 16)
      .setStyle({ backgroundColor: buttonStyle.bg, color: '#173529', font: buttonStyle.font, fixedWidth: 210, align: 'center' })
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
    const originalSetInteractive = button.setInteractive.bind(button);
    const originalDisableInteractive = button.disableInteractive.bind(button);
    button.setInteractive = (...args) => {
      button.setAlpha(1).setStyle({ backgroundColor: buttonStyle.bg, color: '#173529' });
      return originalSetInteractive(...args);
    };
    button.disableInteractive = (...args) => {
      button.setAlpha(0.62).setStyle({ backgroundColor: buttonStyle.disabled, color: '#d6ded9' });
      return originalDisableInteractive(...args);
    };
    return button
  }

}
