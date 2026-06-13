import { RegisterManager } from '../managers/RegisterManager.js';
import { DialogueManager } from '../managers/DialogueManager.js';
import { EffectManager } from '../managers/EffectManager.js';

export class RegisterScene extends Phaser.Scene {
 
    constructor() {
        super('RegisterScene');
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
        this.load.image('CircleEmpty', 'assets/ui/CircleEmpty.png');
        this.load.image('CircleFilled', 'assets/ui/CircleFilled.png');
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
       
    createMenu() {
        const {width, height} = this.scale;
        this.addCenteredBitmapText(width / 2, height / 2 - 75, 'Tela de Cadastro');
        
        const buttomAcompanhante = this.add.image(Math.round(width / 2 - 10 ), Math.round(height / 2 - 45 ), 'CircleEmpty');
        buttomAcompanhante.setDisplaySize(50, 50); buttomAcompanhante.setAlpha(0.8); buttomAcompanhante.setInteractive();
        this.addCenteredBitmapText(width / 2 - 60, height / 2 - 50, 'Acompanhante');

        const buttomJogador = this.add.image(Math.round(width / 2 + 75), Math.round(height / 2 - 45 ), 'CircleEmpty');
        buttomJogador.setDisplaySize(50, 50); buttomJogador.setAlpha(0.8); buttomJogador.setInteractive();
        this.addCenteredBitmapText(width / 2 + 40, height / 2 - 50, 'Jogador');

        this.addCenteredBitmapText(width / 2 - 60, height / 2 - 25, 'Usuario:');
        const UserBox = this.add.image(Math.round(width / 2 + 40), Math.round(height / 2 - 25), 'ui_box_narrator');
        UserBox.setDisplaySize(160,20); UserBox.setAlpha(0.8); 
        this.userText = this.add.bitmapText(Math.round(width / 2 - 37), Math.round(height / 2 - 32), 'pixelFont', '', 16);

        this.addCenteredBitmapText(width / 2 - 60, height / 2 - 5, 'Email:');
        const emailBox = this.add.image(Math.round(width / 2 + 40), Math.round(height / 2 - 1), 'ui_box_narrator');
        emailBox.setDisplaySize(160,20); emailBox.setAlpha(0.8); 
        this.emailText = this.add.bitmapText(Math.round(width / 2 - 36), Math.round(height / 2 - 8), 'pixelFont', '', 16);

        this.addCenteredBitmapText(width / 2 - 60, height / 2 + 20, 'Senha:');
        const senhaBox = this.add.image(Math.round(width / 2 + 40), Math.round(height / 2 + 22), 'ui_box_narrator');
        senhaBox.setDisplaySize(160,20); senhaBox.setAlpha(0.8); 
        this.senhaText = this.add.bitmapText(Math.round(width / 2 - 37), Math.round(height / 2 + 13), 'pixelFont', '', 16);

        this.addCenteredBitmapText(width / 2 - 83, height / 2 + 40, 'Confirmar Senha:');
        const confirmSenhaBox = this.add.image(Math.round(width / 2 + 40), Math.round(height / 2 + 45), 'ui_box_narrator');
        confirmSenhaBox.setDisplaySize(160,20); confirmSenhaBox.setAlpha(0.8); 
        this.confirmSenhaText = this.add.bitmapText(Math.round(width / 2 - 37), Math.round(height / 2 + 38), 'pixelFont', '', 16);

        const confirmButtom = this.add.image(Math.round(width / 2 - 15), Math.round(height / 2 + 68), 'confirm_box');
        confirmButtom.setDisplaySize(50, 20);
        this.addCenteredBitmapText(width / 2 - 13, height / 2 + 67, 'Confirmar');

        const backButtom = this.add.image(Math.round(width / 2 + 40), Math.round(height / 2 + 68), 'confirm_box');
        backButtom.setDisplaySize(50, 20);      
        this.addCenteredBitmapText(width / 2 + 42, height / 2 + 67, 'Voltar');

        this.userDigitado = ''; this.emailDigitado = ''; this.senhaDigitada = ''; this.confirmSenhaDigitada = '';
        this.campoAtivo = ''; this.mostrarSenha = false; this.cursorVisible = true; this.tipoUsuario = 'jogador'; // default pra facilitar o teste

        this.time.addEvent({ delay: 500, loop: true, callback: () => { this.cursorVisible = !this.cursorVisible; this.atualizarExibicaoSenhas(); } });
        
        const mostrarSenhaBtn = this.add.image(Math.round(width / 2 + 140), Math.round(height / 2 + 33), 'ui_box_narrator'); 
        mostrarSenhaBtn.setDisplaySize(30, 20); mostrarSenhaBtn.setInteractive();
        const mostrarSenhaBtnLabel = this.addCenteredBitmapText(width / 2 + 140, height / 2 + 33, 'Ver');
         
        mostrarSenhaBtn.on('pointerdown', () => {
            this.mostrarSenha = !this.mostrarSenha;
            mostrarSenhaBtnLabel.setText(this.mostrarSenha ? 'Ocultar' : 'Ver');
            mostrarSenhaBtnLabel.setPosition(Math.round((width / 2 + 140) - (mostrarSenhaBtnLabel.width / 2)), Math.round((height / 2 + 33) - (mostrarSenhaBtnLabel.height / 2)));
            this.atualizarExibicaoSenhas();
        });

        buttomAcompanhante.on('pointerdown', () => {
            buttomAcompanhante.setTexture('CircleFilled'); buttomJogador.setTexture('CircleEmpty'); this.tipoUsuario = 'acompanhante';
        });
        buttomJogador.on('pointerdown', () => {
            buttomJogador.setTexture('CircleFilled'); buttomAcompanhante.setTexture('CircleEmpty'); this.tipoUsuario = 'jogador';
        });

        const htmlUser = document.createElement('input'); htmlUser.type = 'text'; htmlUser.id = 'nome';
        htmlUser.style = 'width: 160px; height: 20px; opacity: 0.01; cursor: text; border: none; padding: 0; outline: none; box-sizing: border-box; background: transparent; color: transparent;';
        this.add.dom(width / 2 + 40, height / 2 - 25, htmlUser);
        htmlUser.addEventListener('input', (e) => { this.userDigitado = e.target.value; this.atualizarExibicaoSenhas(); });
        htmlUser.addEventListener('focus', () => { this.input.keyboard.enabled = false; this.campoAtivo = 'usuario'; this.cursorVisible = true; this.atualizarExibicaoSenhas(); });
        htmlUser.addEventListener('blur', () => { this.input.keyboard.enabled = true; });

        const htmlEmail = document.createElement('input'); htmlEmail.type = 'email'; htmlEmail.id = 'email_reg';
        htmlEmail.style = 'width: 160px; height: 20px; opacity: 0.01; cursor: text; border: none; padding: 0; outline: none; box-sizing: border-box; background: transparent; color: transparent;';
        this.add.dom(width / 2 + 40, height / 2 - 1, htmlEmail);
        htmlEmail.addEventListener('input', (e) => { this.emailDigitado = e.target.value; this.atualizarExibicaoSenhas(); });
        htmlEmail.addEventListener('focus', () => { this.input.keyboard.enabled = false; this.campoAtivo = 'email'; this.cursorVisible = true; this.atualizarExibicaoSenhas(); });
        htmlEmail.addEventListener('blur', () => { this.input.keyboard.enabled = true; });

        const htmlSenha = document.createElement('input'); htmlSenha.type = 'password'; htmlSenha.id = 'senha_reg';
        htmlSenha.style = 'width: 160px; height: 20px; opacity: 0.01; cursor: text; border: none; padding: 0; outline: none; box-sizing: border-box; background: transparent; color: transparent;';
        this.add.dom(width / 2 + 40, height / 2 + 22, htmlSenha);
        htmlSenha.addEventListener('input', (e) => { this.senhaDigitada = e.target.value; this.atualizarExibicaoSenhas(); });
        htmlSenha.addEventListener('focus', () => { this.input.keyboard.enabled = false; this.campoAtivo = 'senha'; this.cursorVisible = true; this.atualizarExibicaoSenhas(); });
        htmlSenha.addEventListener('blur', () => { this.input.keyboard.enabled = true; });

        const htmlConfSenha = document.createElement('input'); htmlConfSenha.type = 'password';
        htmlConfSenha.style = 'width: 160px; height: 20px; opacity: 0.01; cursor: text; border: none; padding: 0; outline: none; box-sizing: border-box; background: transparent; color: transparent;';
        this.add.dom(width / 2 + 40, height / 2 + 45, htmlConfSenha);
        htmlConfSenha.addEventListener('input', (e) => { this.confirmSenhaDigitada = e.target.value; this.atualizarExibicaoSenhas(); });
        htmlConfSenha.addEventListener('focus', () => { this.input.keyboard.enabled = false; this.campoAtivo = 'confirmSenha'; this.cursorVisible = true; this.atualizarExibicaoSenhas(); });
        htmlConfSenha.addEventListener('blur', () => { this.input.keyboard.enabled = true; });

        const htmlConfirmBtn = document.createElement('button'); htmlConfirmBtn.id = 'btn-cadastrar';
        htmlConfirmBtn.style = 'width: 50px; height: 20px; opacity: 0.01; cursor: pointer; border: none; padding: 0; background: transparent; color: transparent;';
        this.add.dom(width / 2 - 15, height / 2 + 68, htmlConfirmBtn);
        htmlConfirmBtn.onclick = () => {
            confirmButtom.setTint(0xff0000);
            if(this.userDigitado === '' || this.emailDigitado === '' || this.senhaDigitada === '' || this.tipoUsuario === '') {
                this.ErroScreen('Preencha todos os campos!');
                return;
            }  else {
                if (this.emailDigitado === 'teste@alchemical.com') {
                    this.ErroScreen('Este e-mail já está em uso');
                    return;
                }
                
                if(this.domErro) this.domErro.innerText = 'Cadastro realizado com sucesso';
                this.time.delayedCall(500, () => this.scene.start('LoginScene'));
            }
        };

        const htmlBackBtn = document.createElement('button');
        htmlBackBtn.style = 'width: 50px; height: 20px; opacity: 0.01; cursor: pointer; border: none; padding: 0; background: transparent; color: transparent;';
        this.add.dom(width / 2 + 40, height / 2 + 68, htmlBackBtn);
        htmlBackBtn.onclick = () => { backButtom.setTint(0xff0000); this.scene.start('LoginScene'); };
    }

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

    ErroScreen(mensagem) {
        if(this.domErro) this.domErro.innerText = mensagem; 
        
        const {width, height} = this.scale;
        const errorText = this.addCenteredBitmapText(width / 2, height / 2 - 63, mensagem);
        errorText.setDepth(100);
        errorText.setTint(0xff0000);
   
        this.time.delayedCall(1000, () => { 
            errorText.destroy();
            this.userDigitado = ''; this.emailDigitado = ''; this.senhaDigitada = ''; this.confirmSenhaDigitada = '';
            this.atualizarExibicaoSenhas();
            return this.scene.start('RegisterScene');
        });
    }
}