import {RegisterManager} from '../managers/RegisterManager.js'
import { DialogueManager } from '../managers/DialogueManager.js';
import { EffectManager } from '../managers/EffectManager.js';

export class RegisterScene extends Phaser.Scene{
 
    constructor()
    {
        super('RegisterScene');
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
         
         //é o botão de escrever.
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
            // Aqui você pode criar os campos de entrada para email e senha, e o botão de registro
            const {width, height} = this.scale;
            //Titulo da tela de cadastro
            this.add.bitmapText(width / 2, height / 2 - 75, 'pixelFont', 'Tela de Cadastro', 20).setOrigin(0.5);

            //Usuario
             this.add.bitmapText(width / 2 - 60, height / 2 - 25, 'pixelFont', 'Usuario:', 18).setOrigin(0.5);
            // Usuario Caixa de texto
            const UserBox = this.add.image(width / 2 - 60 + 100, height / 2 - 25, 'ui_box_narrator');
            UserBox.setDisplaySize(160,20);
            UserBox.setAlpha(0.8); 
            UserBox.setInteractive();

            //escrever dentro da caixa de usuario
           this.userText = this.add.bitmapText(width / 2 - 60 + 23, height / 2 - 32, 'pixelFont', '', 18);

            //Email
            this.add.bitmapText(width / 2 - 60, height / 2 - 5, 'pixelFont', 'Email:', 18).setOrigin(0.5);
            // Email Caixa de texto
            const emailBox = this.add.image(width / 2 - 60 + 100, height / 2 - 1, 'ui_box_narrator');
            emailBox.setDisplaySize(160,20);
            emailBox.setAlpha(0.8); 
            emailBox.setInteractive();
            //escrever dentro da caixa de email
            this.emailText = this.add.bitmapText(width / 2 - 60 + 23, height / 2 - 8, 'pixelFont', '', 18);

            //Senha
            this.add.bitmapText(width / 2 - 60, height / 2 + 20, 'pixelFont', 'Senha:', 18).setOrigin(0.5);

            // Senha Caixa de texto
            const senhaBox = this.add.image(width / 2 - 60 + 100, height / 2 + 22, 'ui_box_narrator');
            senhaBox.setDisplaySize(160,20);
            senhaBox.setAlpha(0.8); 
            senhaBox.setInteractive();

            //escrever dentro da caixa de senha
            this.senhaText = this.add.bitmapText(width / 2 - 60 + 23, height / 2 + 13, 'pixelFont', '', 18);

            //confirmar senha
            this.add.bitmapText(width / 2 - 83, height / 2 + 40, 'pixelFont', 'Confirmar Senha:', 18).setOrigin(0.5);

            // Confirmar Senha Caixa de texto
            const confirmSenhaBox = this.add.image(width / 2 - 60 + 100, height / 2 + 45, 'ui_box_narrator');
            confirmSenhaBox.setDisplaySize(160,20);
            confirmSenhaBox.setAlpha(0.8); 
            confirmSenhaBox.setInteractive();

            //escrever dentro da caixa de confirmar senha
            this.confirmSenhaText = this.add.bitmapText(width / 2 - 60 + 23, height / 2 + 38, 'pixelFont', '', 18);

            //botão de confirmar

            const confirmButtom = this.add.image(width / 2 - 60 + 45, height / 2 + 68, 'confirm_box');
            confirmButtom.setDisplaySize(50, 20);
            confirmButtom.setInteractive();
            this.add.bitmapText(width / 2 - 60 + 47, height / 2 + 67, 'pixelFont', 'Confirmar', 18).setOrigin(0.5);

            //botão de voltar para login
            const backButtom = this.add.image(width / 2 - 60 + 100, height / 2 + 68, 'confirm_box');
            backButtom.setDisplaySize(50, 20);      
            backButtom.setInteractive();
            this.add.bitmapText(width / 2 - 60 + 102, height / 2 + 67, 'pixelFont', 'Voltar', 17).setOrigin(0.5);

            // variáveis para armazenar o que o jogador digitou
            this.userDigitado = '';
            this.emailDigitado = '';
            this.senhaDigitada = '';
            this.confirmSenhaDigitada = '';
            this.campoAtivo = '';

            //clique no campo de usuario
            UserBox.on('pointerdown', () => {
               this.campoAtivo = 'usuario';
               console.log('Usuario');
            });
            //clique no campo de email
            emailBox.on('pointerdown', () => {
               this.campoAtivo = 'email';
               console.log('Email');
            });

            //Clique no campo de senha
            senhaBox.on('pointerdown', () => {
               this.campoAtivo = 'senha';
               console.log('Senha');
            });
            //Clique no campo de confirmar senha
            confirmSenhaBox.on('pointerdown', () => {
               this.campoAtivo = 'confirmSenha';
               console.log('Confirmar Senha');
            });

            
      //ativar o teclado para digitar
      this.input.keyboard.on('keydown', (event) => {
         if (this.campoAtivo === '') return;

         if(event.code === 'Backspace') {
            if (this.campoAtivo === 'usuario') {
               this.userDigitado = this.userDigitado.slice(0, -1);
               this.userText.setText(this.userDigitado);
            }
            else if (this.campoAtivo === 'email') {
               this.emailDigitado = this.emailDigitado.slice(0, -1);
               this.emailText.setText(this.emailDigitado);
            }
             else if (this.campoAtivo === 'senha') {
               this.senhaDigitada = this.senhaDigitada.slice(0, -1);
               this.senhaText.setText(this.senhaDigitada);
            }   
            else if (this.campoAtivo === 'confirmSenha') {
               this.confirmSenhaDigitada = this.confirmSenhaDigitada.slice(0, -1);
               this.confirmSenhaText.setText('*'.repeat(this.confirmSenhaDigitada.length));
            }

            return;}
        
    
          if (event.code === 'Enter') {
            console.log('Usuario:', this.userDigitado);
            console.log('Email:', this.emailDigitado);
            console.log('Senha:', this.senhaDigitada);
            console.log('Confirmar Senha:', this.confirmSenhaDigitada);
            return;
         }
         if(event.key.length === 1) {
      
            if (this.campoAtivo === 'usuario') {
               this.userDigitado += event.key;
               this.userText.setText(this.userDigitado);
            }
          else if (this.campoAtivo === 'email') {
            this.emailDigitado += event.key;
            this.emailText.setText(this.emailDigitado);
         }
         else if (this.campoAtivo === 'senha') {
            this.senhaDigitada += event.key;
            this.senhaText.setText(this.senhaDigitada);
         }
         else if (this.campoAtivo === 'confirmSenha') {
            this.confirmSenhaDigitada += event.key;
            this.confirmSenhaText.setText(this.confirmSenhaDigitada);
         }
       }

            });

            //funcionamento do botão de confirmar
            confirmButtom.on('pointerdown', () => {
             confirmButtom.setTint(0xff0000);
            console.log('Usuario:', this.userDigitado);
            console.log('Email:', this.emailDigitado);
            console.log('Senha:', this.senhaDigitada);
            console.log('Confirmar Senha:', this.confirmSenhaDigitada);

               if(this.userDigitado === '' || this.emailDigitado === '' || this.senhaDigitada === '' || this.confirmSenhaDigitada === '') {
                  console.log('Preencha todos os campos');
                  return this.scene.start('RegisterScene');
               }           
               else{
                // Aqui você pode adicionar a lógica para verificar se as senhas coincidem e se o email é válido, etc.
                const registerManager = new RegisterManager();
                const resultado = registerManager.DoRegister(this.userDigitado, this.emailDigitado, this.senhaDigitada, this.confirmSenhaDigitada);
               
                if (resultado.dados == null) {
                    console.log(resultado.erro);
                    return this.scene.start('RegisterScene'); // Reinicia a cena para limpar os campos e mensagens
                } else {
                    return this.scene.start('LoginScene');
               }
            }
         });
           
            //funcionamento do botão de voltar para login
            backButtom.on('pointerdown', () => {
               backButtom.setTint(0xff0000);
               return this.scene.start('LoginScene');
            });

        }


}