export class GameObjects extends Phaser.Physics.Arcade.Sprite
{
 constructor(scene, x, y, texture, scale = 0.2) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scale = scale;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(scale);
    this.body.setImmovable(true);
    this.setDepth(5);
}
interagir()
{    
    return true;
}


pegar()
{
    this.destruir();
    return true;
}
}