import { DialogueManager } from '../managers/DialogueManager.js';
import { EffectManager } from '../managers/EffectManager.js';
import { SaveManager } from '../managers/SaveManager.js';


export class ChallengeUI extends Phaser.Scene
{
constructor()
{
    super('ChallengeUI');
}

preload()
{
   this.load.image('confirm_box', 'assets/ui/confirm_box.png');
   this.load.bitmapFont('pixelFont', 'assets/fonts/pixelFont/pixelFont.png', 'assets/fonts/pixelFont/pixelFont.xml');
}

create(data)
{
     const { width, height } = this.scale;
     this.dialogue = new DialogueManager(this);

     //guardar a imagem do começo
     this.cenaOrigem = data.cenaOrigem;


     this.createMenu();
    }

createMenu()
{
      const {width,height} = this.scale;
      
      //fundo transparente 
      this.add.rectangle(width /2 ,height/2,width,height,0x000000,0.8);


      //botão de retorno
      const btnretornar = this.add.image(width/2 +110 , height/2 - 70 ,'confirm_box');
      btnretornar.setDisplaySize(50,20);
      btnretornar.setAlpha(0.8);
      btnretornar.setInteractive();
      //texto retornar
      const textoRe =this.add.text(width/ 2 + 90,height/2 -74, 'Retornar', {fontSize:'20px', fontStyle : 'pixelFont'});
      
      //ação do botão de retorno
      btnretornar.on('pointerdown', () => {
        this.scene.stop();
        this.cenaOrigem.scene.resume();});

    //botão de reiniciar
      const btnreiniciar = this.add.image(width/2+10 , height/2 + 70 ,'confirm_box');
      btnreiniciar.setDisplaySize(50,20);
      btnreiniciar.setAlpha(0.8);
      btnreiniciar.setInteractive();

      //texto reiniciar
      const textoRei =this.add.text(width/ 2 - 8,height/2 + 67, 'Reiniciar', {fontSize:'20px', fontStyle : 'pixelFont'});
     
      //ação do botão de reiniciar
      btnreiniciar.on('pointerdown', () => {
        this.mensagemtexto("Reiniciou");    
        this.time.delayedCall(1000,() => {
           return this.scene.restart();
        });
        
      });

      //botão da dica
      const btndica = this.add.image(width/2 - 55, height/2 + 70 ,'confirm_box');
      btndica.setDisplaySize(50,20);
      btndica.setAlpha(0.8);
      btndica.setInteractive();

      //texto de dica
      const textodica =this.add.text(width/ 2 - 62 ,height/2 + 67, 'Dica', {fontSize:'20px', fontStyle : 'pixelFont'});

      //ação do botão de dica
      btndica.on('pointerdown', () => {
        this.mensagemtexto("dica do desafio");
    
      });
    
     

    }

    mensagemtexto(texto){

         const {width, height} = this.scale;

        // const mensagem = this.add.text(width/2,height/2,texto,{fontSize:'20px' , fontStyle:'pixelFont'});
         const mensagem = this.add.text(width/2, height/2, texto, {
        fontSize: '20px',
        fill: '#ffffff'
    });
         mensagem.setOrigin(0.5);
         mensagem.setDepth(100);
         mensagem.setTint(0xffd700);
         

           this.time.delayedCall(1000, () => {
            mensagem.destroy();
            return;
        });
    }
      
}