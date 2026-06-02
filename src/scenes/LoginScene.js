import { LoginManager } from '../managers/LoginManager.js';
import { DialogueManager } from '../managers/DialogueManager.js';
import { EffectManager } from '../managers/EffectManager.js';


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
      this.bgBright = this.add.image(Math.round(width / 2), Math.round(height / 2), 'scene1bright').setAlpha(1);
      this.bgNormal = this.add.sprite(Math.round(width / 2), Math.round(height / 2), 'scene1_frame1').setAlpha(0);
      this.bgNormal.play('anim_candle'); 
      this.curtains = this.add.sprite(Math.round(width / 2), Math.round(height / 2), 'curtains');

       
        this.createMenu();
     }
   
     addCenteredBitmapText(x, y, textStr) {
        const bmpText = this.add.bitmapText(0, 0, 'pixelFont', textStr, 16);
        bmpText.setPosition(Math.round(x - bmpText.width / 2), Math.round(y - bmpText.height / 2));
        return bmpText;
     }

     createMenu(){
      //Aqui coloque os elementos do menu, como botões, campos de texto, etc.
      
      const {width, height} = this.scale;
       //Titulo do jogo
      this.addCenteredBitmapText(width / 2, height / 2 - 50, 'Alchemical');
      //email
      this.addCenteredBitmapText(width / 2 - 50, height / 2 + 10, 'Email:');
      //campo de texto para email
      const emailBox = this.add.image(Math.round(width / 2 + 40), Math.round(height / 2 + 10), 'ui_box_narrator');
       emailBox.setDisplaySize(150,20);
       emailBox.setAlpha(0.8); 
       emailBox.setInteractive();
       //escrever dentro da caixa de email
      this.emailText = this.add.bitmapText(Math.round(width / 2 - 30), Math.round(height / 2 + 2), 'pixelFont', '', 16);
   
      //senha
       this.addCenteredBitmapText(width / 2 - 52, height / 2 + 30, 'Senha:');
      //campo de texto para senha
      const senhaBox = this.add.image(Math.round(width / 2 + 40), Math.round(height / 2 + 35), 'ui_box_narrator');
       senhaBox.setDisplaySize(150,20);
       senhaBox.setAlpha(0.8); 
       senhaBox.setInteractive();
      //parte de escrever da senha 
      this.senhaText = this.add.bitmapText(Math.round(width / 2 - 30), Math.round(height / 2 + 27), 'pixelFont', '', 16);

      const mostrarSenhaBtn = this.add.image(Math.round(width / 2 + 135), Math.round(height / 2 + 35), 'ui_box_narrator'); 
      mostrarSenhaBtn.setDisplaySize(35, 20);
      mostrarSenhaBtn.setInteractive();
      
      const mostrarSenhaBtnLabel = this.addCenteredBitmapText(width / 2 + 135, height / 2 + 35, 'Ver');

      mostrarSenhaBtn.on('pointerdown', () => {
         this.mostrarSenha = !this.mostrarSenha;
         mostrarSenhaBtnLabel.setText(this.mostrarSenha ? 'Ocultar' : 'Ver');
         
         mostrarSenhaBtnLabel.setPosition(
             Math.round((width / 2 + 135) - (mostrarSenhaBtnLabel.width / 2)), 
             Math.round((height / 2 + 35) - (mostrarSenhaBtnLabel.height / 2))
         );
         
         this.atualizarExibicaoSenhas();
     });

      //botão de confirmar
      const confirmButtom = this.add.image(Math.round(width / 2), Math.round(height / 2 + 60), 'confirm_box');
      confirmButtom.setDisplaySize(50, 20);
      confirmButtom.setInteractive();
      this.addCenteredBitmapText(width / 2, height / 2 + 58, 'Confirmar');
      
      //botão de cadastro
      const registerButtom = this.add.image(Math.round(width / 2 + 64), Math.round(height / 2 + 60.5), 'confirm_box');
      registerButtom.setDisplaySize(50, 20);      
      registerButtom.setInteractive();
      this.addCenteredBitmapText(width / 2 + 64, height / 2 + 60, 'Cadastrar');

      //variáveis para armazenar o que o jogador digitou
      this.emailDigitado = '';
      this.senhaDigitada = '';
      this.campoAtivo = '';
      this.mostrarSenha = false;
      this.cursorVisible = true;

      this.time.addEvent({
          delay: 500,
          loop: true,
          callback: () => {
              this.cursorVisible = !this.cursorVisible;
              this.atualizarExibicaoSenhas();
          }
      });

      //clique no campo de email
      emailBox.on('pointerdown', () => {
         this.campoAtivo = 'email';
         console.log('Email');
         this.cursorVisible = true;
         this.atualizarExibicaoSenhas();
      });

      //Clique no campo de senha
      senhaBox.on('pointerdown', () => {
         this.campoAtivo = 'senha';
         console.log('Senha');
         this.cursorVisible = true;
         this.atualizarExibicaoSenhas();
      });

      //ativar o teclado para digitar
      this.input.keyboard.on('keydown', (event) => {
         if (this.campoAtivo === '') return;

         if(event.code === 'Backspace') {
            if (this.campoAtivo === 'email') {
               this.emailDigitado = this.emailDigitado.slice(0, -1);
            }
             else if (this.campoAtivo === 'senha') {
               this.senhaDigitada = this.senhaDigitada.slice(0, -1);
            }   
            this.cursorVisible = true;
            this.atualizarExibicaoSenhas();
            return;}

    
          if (event.code === 'Enter') {
            console.log('Email:', this.emailDigitado);
            console.log('Senha:', this.senhaDigitada);
            return;
         }
         if(event.key.length === 1) {
      
         if (this.campoAtivo === 'email') {
            this.emailDigitado += event.key;
         }
         else if (this.campoAtivo === 'senha') {
            this.senhaDigitada += event.key;
         }
         this.cursorVisible = true;
         this.atualizarExibicaoSenhas();
       }
      
      });
      //funcionamento do botão de confirmar
         confirmButtom.on('pointerdown', async () => {
             confirmButtom.setTint(0xff0000);
           
            if(this.emailDigitado === '' || this.senhaDigitada === '') {
               this.ErroScreen('Preencha todos os campos!');
               return;
            }
            else {
              
             const loginManager = new LoginManager();
             const resultado = await loginManager.Dologin(this.emailDigitado, this.senhaDigitada);
              
             // senha ou email errados
             if(resultado.dados == null) { 
                 this.ErroScreen(resultado.erro);
                 return;
             }
             else {
                 return this.scene.start('Start');
             }
            }
         
     });

         //funcionamento do botão de cadastro

         registerButtom.on('pointerdown', () => {
            registerButtom.setTint(0xff0000);
            return this.scene.start('RegisterScene');
            // Aqui vai para a tela de cadastro
           // this.scene.start('Register');
         });
   }
   
   // atualiza a exibição do email e senha, mostrando o cursor piscando
   atualizarExibicaoSenhas() {
      if (!this.senhaDigitada) this.senhaDigitada = '';
      
      const cursor = this.cursorVisible ? 'I' : '';

      this.emailText.setText(this.emailDigitado + (this.campoAtivo === 'email' ? cursor : ''));

      if (this.mostrarSenha) {
          this.senhaText.setText(this.senhaDigitada + (this.campoAtivo === 'senha' ? cursor : ''));
      } else {
          this.senhaText.setText('*'.repeat(this.senhaDigitada.length) + (this.campoAtivo === 'senha' ? cursor : ''));
      }
   }

   ErroScreen(mensagem) {
      const {width, height} = this.scale;
      // Exibe a mensagem de erro na tela
      const errorText = this.addCenteredBitmapText(width / 2, height / 2 - 18, mensagem);
      errorText.setDepth(100);
      errorText.setTint(0xff0000);
   
   this.time.delayedCall(1000, () => { errorText.destroy();
      this.scene.start('LoginScene'); // Reinicia a cena para limpar os campos e mensagens
});
}
}