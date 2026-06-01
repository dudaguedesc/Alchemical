import { RegisterManager } from '../managers/RegisterManager.js';
import { DialogueManager } from '../managers/DialogueManager.js';
import { EffectManager } from '../managers/EffectManager.js';

export class RegisterScene extends Phaser.Scene {
 
    constructor() {
        super('RegisterScene');
    }

    preload() {    
        //tela inicial 
        this.load.image('scene1_frame1', 'assets/intro/scene1_1.png');
        this.load.image('scene1_frame2', 'assets/intro/scene1_2.png');
        this.load.image('scene1bright', 'assets/intro/scene1bright.png');

        //botão de confirmar
        this.load.image('confirm_box', 'assets/ui/confirm_box.png');
         
        //botão de escrever
        this.load.image('ui_box_narrator','assets/ui/ui_box_narrator.png')

        //spritesheets 
        this.load.spritesheet('curtains', 'assets/intro/curtains.png', { frameWidth: 320, frameHeight: 180 });

        //audio
        this.load.audio('intro', 'assets/audio/intro.wav');

        //fonte
        this.load.bitmapFont('pixelFont', 'assets/fonts/pixelFont/pixelFont.png', 'assets/fonts/pixelFont/pixelFont.xml');
    }
    
    create() {
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

    // funçao para substituir o setOrigin(0.5) e centralizar o texto mesmo que ele mude de tamanho
    addCenteredBitmapText(x, y, textStr) {
        const bmpText = this.add.bitmapText(0, 0, 'pixelFont', textStr, 16);
        bmpText.setPosition(Math.round(x - bmpText.width / 2), Math.round(y - bmpText.height / 2));
        return bmpText;
    }
       
    createMenu() {
        const {width, height} = this.scale;

        //Titulo da tela de cadastro
        this.addCenteredBitmapText(width / 2, height / 2 - 75, 'Tela de Cadastro');

        //Usuario
        this.addCenteredBitmapText(width / 2 - 60, height / 2 - 25, 'Usuario:');
        
        // Usuario Caixa de texto
        const UserBox = this.add.image(Math.round(width / 2 - 60 + 100), Math.round(height / 2 - 25), 'ui_box_narrator');
        UserBox.setDisplaySize(160,20);
        UserBox.setAlpha(0.8); 
        UserBox.setInteractive();

        //escrever dentro da caixa de usuario
        this.userText = this.add.bitmapText(Math.round(width / 2 - 60 + 23), Math.round(height / 2 - 32), 'pixelFont', '', 16);

        //Email
        this.addCenteredBitmapText(width / 2 - 60, height / 2 - 5, 'Email:');
        
        // Email Caixa de texto
        const emailBox = this.add.image(Math.round(width / 2 - 60 + 100), Math.round(height / 2 - 1), 'ui_box_narrator');
        emailBox.setDisplaySize(160,20);
        emailBox.setAlpha(0.8); 
        emailBox.setInteractive();
        
        //escrever dentro da caixa de email
        this.emailText = this.add.bitmapText(Math.round(width / 2 - 60 + 23), Math.round(height / 2 - 8), 'pixelFont', '', 16);

        //Senha
        this.addCenteredBitmapText(width / 2 - 60, height / 2 + 20, 'Senha:');

        // Senha Caixa de texto
        const senhaBox = this.add.image(Math.round(width / 2 - 60 + 100), Math.round(height / 2 + 22), 'ui_box_narrator');
        senhaBox.setDisplaySize(160,20);
        senhaBox.setAlpha(0.8); 
        senhaBox.setInteractive();

        //escrever dentro da caixa de senha
        this.senhaText = this.add.bitmapText(Math.round(width / 2 - 60 + 23), Math.round(height / 2 + 13), 'pixelFont', '', 16);

        //confirmar senha
        this.addCenteredBitmapText(width / 2 - 83, height / 2 + 40, 'Confirmar Senha:');

        // Confirmar Senha Caixa de texto
        const confirmSenhaBox = this.add.image(Math.round(width / 2 - 60 + 100), Math.round(height / 2 + 45), 'ui_box_narrator');
        confirmSenhaBox.setDisplaySize(160,20);
        confirmSenhaBox.setAlpha(0.8); 
        confirmSenhaBox.setInteractive();

        //escrever dentro da caixa de confirmar senha
        this.confirmSenhaText = this.add.bitmapText(Math.round(width / 2 - 60 + 23), Math.round(height / 2 + 38), 'pixelFont', '', 16);

        //botão de confirmar
        const confirmButtom = this.add.image(Math.round(width / 2 - 60 + 45), Math.round(height / 2 + 68), 'confirm_box');
        confirmButtom.setDisplaySize(50, 20);
        confirmButtom.setInteractive();
        this.addCenteredBitmapText(width / 2 - 60 + 47, height / 2 + 67, 'Confirmar');

        //botão de voltar para login
        const backButtom = this.add.image(Math.round(width / 2 - 60 + 100), Math.round(height / 2 + 68), 'confirm_box');
        backButtom.setDisplaySize(50, 20);      
        backButtom.setInteractive();
        this.addCenteredBitmapText(width / 2 - 60 + 102, height / 2 + 67, 'Voltar');

        // variáveis para armazenar o que o jogador digitou
        this.userDigitado = '';
        this.emailDigitado = '';
        this.senhaDigitada = '';
        this.confirmSenhaDigitada = '';
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
        
        //clique no campo de usuario
        UserBox.on('pointerdown', () => {
            this.campoAtivo = 'usuario';
            console.log('Usuario');
            this.cursorVisible = true;
            this.atualizarExibicaoSenhas();
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
        
        //Clique no campo de confirmar senha
        confirmSenhaBox.on('pointerdown', () => {
            this.campoAtivo = 'confirmSenha';
            console.log('Confirmar Senha');
            this.cursorVisible = true;
            this.atualizarExibicaoSenhas();
        });
        
        //mostrar senha
        const mostrarSenhaBtn = this.add.image(Math.round(width / 2 + 140), Math.round(height / 2 + 33), 'ui_box_narrator'); 
        mostrarSenhaBtn.setDisplaySize(30, 20);
        mostrarSenhaBtn.setInteractive();
        
        const mostrarSenhaBtnLabel = this.addCenteredBitmapText(width / 2 + 140, height / 2 + 33, 'Ver');
         
        mostrarSenhaBtn.on('pointerdown', () => {
            this.mostrarSenha = !this.mostrarSenha;
            mostrarSenhaBtnLabel.setText(this.mostrarSenha ? 'Ocultar' : 'Ver');
            
            // Recalcula o centro da palavra sempre que ela mudar de "Ver" para "Ocultar"
            mostrarSenhaBtnLabel.setPosition(
                Math.round((width / 2 + 140) - (mostrarSenhaBtnLabel.width / 2)), 
                Math.round((height / 2 + 33) - (mostrarSenhaBtnLabel.height / 2))
            );
            
            this.atualizarExibicaoSenhas();
        });

        //ativar o teclado para digitar
        this.input.keyboard.on('keydown', (event) => {
            if (this.campoAtivo === '') return;
            
            if (event.code === 'Backspace') {
                if (this.campoAtivo === 'usuario') {
                    this.userDigitado = this.userDigitado.slice(0, -1);
                }
                else if (this.campoAtivo === 'email') {
                    this.emailDigitado = this.emailDigitado.slice(0, -1);
                }
                else if (this.campoAtivo === 'senha') {
                    this.senhaDigitada = this.senhaDigitada.slice(0, -1);
                }   
                else if (this.campoAtivo === 'confirmSenha') {
                    this.confirmSenhaDigitada = this.confirmSenhaDigitada.slice(0, -1);
                }
                this.cursorVisible = true;
                this.atualizarExibicaoSenhas();
                return;
            }
        
            if (event.code === 'Enter') {
                console.log('Usuario:', this.userDigitado);
                return;
            }

            if(event.key.length === 1) {
                if (this.campoAtivo === 'usuario') {
                    this.userDigitado += event.key;
                }
                else if (this.campoAtivo === 'email') {
                    this.emailDigitado += event.key;
                }
                else if (this.campoAtivo === 'senha') {
                    this.senhaDigitada += event.key;
                }
                else if (this.campoAtivo === 'confirmSenha') {
                    this.confirmSenhaDigitada += event.key;
                }
                this.cursorVisible = true;
                this.atualizarExibicaoSenhas();
            }
        });

        //funcionamento do botão de confirmar
        confirmButtom.on('pointerdown', () => {
            confirmButtom.setTint(0xff0000);
           
            if(this.userDigitado === '' || this.emailDigitado === '' || this.senhaDigitada === '' || this.confirmSenhaDigitada === '') {
                this.ErroScreen('Preencha todos os campos!');
                return; 
            }           
            else{
                const registerManager = new RegisterManager();
                const resultado = registerManager.DoRegister(this.userDigitado, this.emailDigitado, this.senhaDigitada, this.confirmSenhaDigitada);
               
                if (resultado.dados == null) {
                    this.ErroScreen(resultado.erro);
                    return; 
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

    // atualiza a exibição do email e senha, mostrando o cursor piscando
    atualizarExibicaoSenhas() {
        if (!this.senhaDigitada) this.senhaDigitada = '';
        if (!this.confirmSenhaDigitada) this.confirmSenhaDigitada = '';

        const cursor = this.cursorVisible ? 'I' : '';

        this.userText.setText(this.userDigitado + (this.campoAtivo === 'usuario' ? cursor : ''));
        this.emailText.setText(this.emailDigitado + (this.campoAtivo === 'email' ? cursor : ''));

        if (this.mostrarSenha) {
            this.senhaText.setText(this.senhaDigitada + (this.campoAtivo === 'senha' ? cursor : ''));
            this.confirmSenhaText.setText(this.confirmSenhaDigitada + (this.campoAtivo === 'confirmSenha' ? cursor : ''));
        } else {
            this.senhaText.setText('*'.repeat(this.senhaDigitada.length) + (this.campoAtivo === 'senha' ? cursor : ''));
            this.confirmSenhaText.setText('*'.repeat(this.confirmSenhaDigitada.length) + (this.campoAtivo === 'confirmSenha' ? cursor : ''));
        }
    }
    
    //função para exibir mensagens de erro
    ErroScreen(mensagem) {
        const {width, height} = this.scale;
         
        //centraliza a mensagem de erro e a pinta de vermelho, depois de 1 segundo ela desaparece e limpa os campos de texto
        const errorText = this.addCenteredBitmapText(width / 2, height / 2 - 50, mensagem);
        errorText.setDepth(100);
        errorText.setTint(0xff0000);
   
        this.time.delayedCall(1000, () => { 
            errorText.destroy();
            this.userDigitado = '';
            this.emailDigitado = '';
            this.senhaDigitada = '';
            this.confirmSenhaDigitada = '';
            this.atualizarExibicaoSenhas();
        });
    }
}