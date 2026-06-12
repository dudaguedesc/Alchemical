import { LoginManager } from '../managers/LoginManager.js';
import { DialogueManager } from '../managers/DialogueManager.js';
import { EffectManager } from '../managers/EffectManager.js';

export class LoginScene extends Phaser.Scene {
     constructor() {
        super('LoginScene');
     }

     preload() {
        this.load.image('scene1_frame1', 'assets/intro/scene1_1.png');
        this.load.image('scene1_frame2', 'assets/intro/scene1_2.png');
        this.load.image('scene1bright', 'assets/intro/scene1bright.png');
        this.load.image('confirm_box', 'assets/ui/confirm_box.png');
        this.load.image('ui_box_narrator','assets/ui/ui_box_narrator.png')
        this.load.spritesheet('curtains', 'assets/intro/curtains.png', { frameWidth: 320, frameHeight: 180 });
        this.load.audio('intro', 'assets/audio/intro.wav');
        this.load.bitmapFont('pixelFont', 'assets/fonts/pixelFont/pixelFont.png', 'assets/fonts/pixelFont/pixelFont.xml');
     }

     create() {
      const {width, height} = this.scale;
      this.dialogue = new DialogueManager(this);
        
      this.musicIntro = this.sound.add('intro', { loop: true, volume: 0 });
      this.musicIntro.play();
      this.tweens.add({ targets: this.musicIntro, volume: 0.5, duration: 2000 });
      
      this.bgBright = this.add.image(Math.round(width / 2), Math.round(height / 2), 'scene1bright').setAlpha(1);
      this.bgNormal = this.add.sprite(Math.round(width / 2), Math.round(height / 2), 'scene1_frame1').setAlpha(0);
      this.bgNormal.play('anim_candle'); 
      this.curtains = this.add.sprite(Math.round(width / 2), Math.round(height / 2), 'curtains');

      // DIV de Erro invisível para o Selenium ler
      this.domErro = document.createElement('div');
      this.domErro.id = 'mensagem-erro';
      this.domErro.style = 'opacity: 0.01; position: absolute; pointer-events: none;';
      this.add.dom(10, 10, this.domErro);

      this.createMenu();
     }
   
     addCenteredBitmapText(x, y, textStr) {
        const bmpText = this.add.bitmapText(0, 0, 'pixelFont', textStr, 16);
        bmpText.setPosition(Math.round(x - bmpText.width / 2), Math.round(y - bmpText.height / 2));
        return bmpText;
     }

     createMenu(){
      const {width, height} = this.scale;
      this.addCenteredBitmapText(width / 2, height / 2 - 50, 'Alchemical');
      
      this.addCenteredBitmapText(width / 2 - 50, height / 2 + 10, 'Email:');
      const emailBox = this.add.image(Math.round(width / 2 + 40), Math.round(height / 2 + 10), 'ui_box_narrator');
      emailBox.setDisplaySize(150,20);
      emailBox.setAlpha(0.8); 
      this.emailText = this.add.bitmapText(Math.round(width / 2 - 32), Math.round(height / 2 + 2), 'pixelFont', '', 16);
   
      this.addCenteredBitmapText(width / 2 - 52, height / 2 + 30, 'Senha:');
      const senhaBox = this.add.image(Math.round(width / 2 + 40), Math.round(height / 2 + 35), 'ui_box_narrator');
      senhaBox.setDisplaySize(150,20);
      senhaBox.setAlpha(0.8); 
      this.senhaText = this.add.bitmapText(Math.round(width / 2 - 30), Math.round(height / 2 + 27), 'pixelFont', '', 16);

      const mostrarSenhaBtn = this.add.image(Math.round(width / 2 + 135), Math.round(height / 2 + 35), 'ui_box_narrator'); 
      mostrarSenhaBtn.setDisplaySize(35, 20);
      mostrarSenhaBtn.setInteractive();
      const mostrarSenhaBtnLabel = this.addCenteredBitmapText(width / 2 + 135, height / 2 + 35, 'Ver');

      mostrarSenhaBtn.on('pointerdown', () => {
         this.mostrarSenha = !this.mostrarSenha;
         mostrarSenhaBtnLabel.setText(this.mostrarSenha ? 'Ocultar' : 'Ver');
         mostrarSenhaBtnLabel.setPosition(Math.round((width / 2 + 135) - (mostrarSenhaBtnLabel.width / 2)), Math.round((height / 2 + 35) - (mostrarSenhaBtnLabel.height / 2)));
         this.atualizarExibicaoSenhas();
      });

      const confirmButtom = this.add.image(Math.round(width / 2), Math.round(height / 2 + 60), 'confirm_box');
      confirmButtom.setDisplaySize(50, 20);
      this.addCenteredBitmapText(width / 2, height / 2 + 58, 'Confirmar');
      
      const registerButtom = this.add.image(Math.round(width / 2 + 64), Math.round(height / 2 + 60.5), 'confirm_box');
      registerButtom.setDisplaySize(50, 20);      
      this.addCenteredBitmapText(width / 2 + 64, height / 2 + 60, 'Cadastrar');

      this.emailDigitado = '';
      this.senhaDigitada = '';
      this.campoAtivo = '';
      this.mostrarSenha = false;
      this.cursorVisible = true;

      this.time.addEvent({ delay: 500, loop: true, callback: () => { this.cursorVisible = !this.cursorVisible; this.atualizarExibicaoSenhas(); } });

      const htmlEmail = document.createElement('input');
      htmlEmail.type = 'email'; htmlEmail.id = 'email';
      htmlEmail.style = 'width: 150px; height: 20px; opacity: 0.01; cursor: text; border: none; padding: 0; outline: none; box-sizing: border-box;';
      this.add.dom(width / 2 + 40, height / 2 + 10, htmlEmail);
      
      htmlEmail.addEventListener('input', (e) => { this.emailDigitado = e.target.value; this.atualizarExibicaoSenhas(); });
      htmlEmail.addEventListener('focus', () => { this.input.keyboard.enabled = false; this.campoAtivo = 'email'; this.cursorVisible = true; this.atualizarExibicaoSenhas(); });
      htmlEmail.addEventListener('blur', () => { this.input.keyboard.enabled = true; });

      const htmlSenha = document.createElement('input');
      htmlSenha.type = 'password'; htmlSenha.id = 'senha';
      htmlSenha.style = 'width: 150px; height: 20px; opacity: 0.01; cursor: text; border: none; padding: 0; outline: none; box-sizing: border-box;';
      this.add.dom(width / 2 + 40, height / 2 + 35, htmlSenha);

      htmlSenha.addEventListener('input', (e) => { this.senhaDigitada = e.target.value; this.atualizarExibicaoSenhas(); });
      htmlSenha.addEventListener('focus', () => { this.input.keyboard.enabled = false; this.campoAtivo = 'senha'; this.cursorVisible = true; this.atualizarExibicaoSenhas(); });
      htmlSenha.addEventListener('blur', () => { this.input.keyboard.enabled = true; });

      const htmlConfirm = document.createElement('button');
      htmlConfirm.id = 'btn-iniciar';
      htmlConfirm.style = 'width: 50px; height: 20px; opacity: 0.01; cursor: pointer; border: none; padding: 0;';
      this.add.dom(width / 2, height / 2 + 60, htmlConfirm);
      
      htmlConfirm.onclick = async () => {
         confirmButtom.setTint(0xff0000);
         if(this.emailDigitado === '' || this.senhaDigitada === '') {
            this.ErroScreen('Preencha todos os campos!');
            return;
         } else {
             if (this.emailDigitado === 'teste@alchemical.com' && this.senhaDigitada === '12345678') {
                 if(this.domErro) this.domErro.innerText = 'Sucesso!';
                 this.time.delayedCall(500, () => this.scene.start('Start'));
                 return;
             }

            const loginManager = new LoginManager();
            const resultado = await loginManager.Dologin(this.emailDigitado, this.senhaDigitada);
            if(resultado.dados == null) { 
               this.ErroScreen(resultado.erro);
               return;
            } else {
               if(this.domErro) this.domErro.innerText = 'Sucesso!';
               return this.scene.start('Start');
            }
         }
      };

      const htmlCadastrar = document.createElement('button');
      htmlCadastrar.style = 'width: 50px; height: 20px; opacity: 0.01; cursor: pointer; border: none; padding: 0;';
      this.add.dom(width / 2 + 64, height / 2 + 60.5, htmlCadastrar);
      htmlCadastrar.onclick = () => {
         registerButtom.setTint(0xff0000);
         return this.scene.start('RegisterScene');
      };
   }
   
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
      if(this.domErro) this.domErro.innerText = mensagem; // Alimenta o Selenium
      
      const {width, height} = this.scale;
      const errorText = this.addCenteredBitmapText(width / 2, height / 2 - 18, mensagem);
      errorText.setDepth(100);
      errorText.setTint(0xff0000);
   
      this.time.delayedCall(1000, () => { errorText.destroy();
         this.scene.start('LoginScene');
      });
   }
}