import {RegisterManager} from '../managers/RegisterManager.js'
export class RegisterManager extends Phaser.Scene{
 
    constructor()
    {
        super('RegisterManager');
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

    create()
    {
        
    }

}