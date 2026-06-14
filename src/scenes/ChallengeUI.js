import { DialogueManager } from '../managers/DialogueManager.js';
import { EffectManager } from '../managers/EffectManager.js';
import { SaveManager } from '../managers/SaveManager.js';


export class ChallangeUI extends Phaser.Scene
{
constructor()
{
    super('ChallangeUI');
}

preload()
{
   this.load.image('menu_box', 'assets/ui/menu_box.png');
   this.load.image('confirm_box', 'assets/ui/confirm_box.png');
   this.load.bitmapFont('pixelFont', 'assets/fonts/pixelFont/pixelFont.png', 'assets/fonts/pixelFont/pixelFont.xml');
}

create(data)
{

     const { width, height } = this.scale;

     //guardar a imagem do começo
     this.cenaOrigem = data.cenaOrigem;

     //fundo semi-transparente
     this.add.rectangle(width /2, height /2, width, height,0x000000, 0.8);

     //janela do desafio
     const janela = this.add.image(width / 2, height / 2, 'menu_box');
     janela.setDisplaySize(500, 400);

     //titulo
      this.add.text(width / 2, height / 2 - 150, 'Primeiro Desafio', {
        fontSize: '36px',
        fill: '#000000',
         fontStyle:'pixelFont'
        }).setOrigin(0.5);

   /*colocar o desafio ou conectar o que faz o desafio*/

   //botão reiniciar
   const btnreiniciar = this.add.image(width / 2 - 130, height / 2 + 150,  'confirm_box');
   btnreiniciar.setDisplaySize(160, 45);
   btnreiniciar.setInteractive();
   this.add.text(width / 2 - 130, height / 2 + 150, 'Reiniciar', {
            fontSize: '20px',
            fontStyle: 'pixelFont',
            fill: '#ffd325'
        }).setOrigin(0.5);

   const btnsair  = this.add.image(width / 2 + 130, height / 2 + 150, 'confirm_box');
    btnsair.setDisplaySize(160, 45);
    btnsair.setInteractive();
    this.add.text(width / 2 + 130, height / 2 + 150, 'Sair', {
            fontSize: '20px',
            fontStyle: 'pixelFOnt',
            fill: '#ffd325'
        }).setOrigin(0.5);


    //ações

    btnreiniciar.on('pointerdown', () => {
    console.log("Reiniciando desafio...");
    this.mostrarMensagem("Desafio reiniciado!");
    /* this.scene.stop();     this.scene.launch('DesafioScene', { cenaOrigem: this.cenaOrigem });  
    
    // Aqui você pode resetar o estado do desafio
    */});
    
    btnsair.on('pointerdown', () => {
    this.scene.stop(); // Fecha a cena do desafio
    this.cenaOrigem.scene.resume(); // Volta a cena do jogo
    });

    this.mensagem = this.add.text(width / 2, height / 2 + 220, '', {
            fontSize: '14px',
            fill: '#00aa00'
        }).setOrigin(0.5);

    }
mostrarMensagem(texto)
{
     this.mensagem.setText(texto);
        this.time.delayedCall(1500, () => {
            this.mensagem.setText('');
        });

}
}