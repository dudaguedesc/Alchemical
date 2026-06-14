export class GameObjects extends Phaser.Physics.Arcade.Sprite
{
 constructor(scene, x, y, texture, scale = 0.055) {
       super(scene, x, y, texture);

    // adiciona o player visualmente e fisicamente na cena
    scene.add.existing(this);
    scene.physics.add.existing(this);
  
    

    // caixa de colisão e profundidade 
    this.setScale(scale);
    this.body.setSize(30, 30);
    this.body.setOffset(10, 15);
    this.setDepth(5);

    this.body.setImmovable(true); 
}

pegar()
{
    this.destroy();
    return true;
}
}