import { DialogueManager } from '../managers/DialogueManager.js';
import { EffectManager } from '../managers/EffectManager.js';
//import { LoginManager } from '../managers/LoginManager.js';

export class LoginScene extends Phaser.Scene {
     constructor()
     {
        super('LoginScene');
     }

     preload()
     {
         // assets da tela inicial

        //tela inicial 
        this.load.image('scene1_frame1', 'assets/intro/scene1_1.png');
        this.load.image('scene1_frame2', 'assets/intro/scene1_2.png');
        this.load.image('scene1bright', 'assets/intro/scene1bright.png');

        //botão de confirmar
         this.load.image('confirm_box', 'assets/ui/confirm_box.png');
         
         //vou tentar fazer que seja o botão de escrever 
         this.load.image('ui_box_narrator','assets/ui/ui_box_narrator.png')

         //spritesheets? 
         this.load.spritesheet('curtains', 'assets/intro/curtains.png', { frameWidth: 320, frameHeight: 180 });

        //audio
         this.load.audio('intro', 'assets/audio/intro.wav');

        //fonte
         this.load.bitmapFont('pixelFont', 'assets/fonts/pixelFont/pixelFont.png', 'assets/fonts/pixelFont/pixelFont.xml');
     }

     create ()
     {
        //O que aparece na tela
      const {width, height} = this.scale;

      this.dialogue = new DialogueManager(this);
        
      // musica de intro
      this.musicIntro = this.sound.add('intro', { loop: true, volume: 0 });
      this.musicIntro.play();
      this.tweens.add({ targets: this.musicIntro, volume: 0.5, duration: 2000 });
      
        
      
      // fundos
      this.bgBright = this.add.image(width / 2, height / 2, 'scene1bright').setAlpha(1);
      this.bgNormal = this.add.sprite(width / 2, height / 2, 'scene1_frame1').setAlpha(0);
      this.bgNormal.play('anim_candle'); 
      this.curtains = this.add.sprite(width / 2, height / 2, 'curtains');

       
        this.createMenu();
     }
   
     createMenu(){
      //Aqui coloque os elementos do menu, como botões, campos de texto, etc.
       
      this.emailDigitado = '';
      this.senhaDigitada = '';
      this.campoAtivo = 'email';

      const {width, height} = this.scale;
       //Titulo do jogo
      this.add.bitmapText(width / 2, height / 2 - 50, 'pixelFont', 'Alchemical', 48).setOrigin(0.5);
      //email
      this.add.bitmapText(width / 2 - 50, height / 2 + 10, 'pixelFont', 'Email:', 18).setOrigin(0.5);
      //campo de texto para email
      const emailBox = this.add.image(width / 2 + 40, height / 2 + 10, 'ui_box_narrator');
       emailBox.setDisplaySize(150,20);
       emailBox.setAlpha(0.8); 
       emailBox.setInteractive();
       //escrever dentro da caixa de email
     
         emailBox.on('pointerdown', () => {
          this.campoAtivo = 'email';
       } );

      //senha
       this.add.bitmapText(width / 2 - 52, height / 2 + 30, 'pixelFont', 'Senha:', 18).setOrigin(0.5);
      //campo de texto para senha
      const senhaBox = this.add.image(width / 2 + 40, height / 2 + 35, 'ui_box_narrator');
       senhaBox.setDisplaySize(150,20);
       senhaBox.setAlpha(0.8); 
       senhaBox.setInteractive();

     }
   
   
}
