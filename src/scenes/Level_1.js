import { DialogueManager } from "../managers/DialogueManager.js";
import { Player } from "../entities/Player.js";
import { AnimationManager } from "../managers/AnimationManager.js";
import { SaveManager } from "../managers/SaveManager.js";

export class Level_1 extends Phaser.Scene {
    
    constructor() {
        super("Level_1");
    }

    preload() {
        // mapas
        this.load.image("tileset", "assets/maps/tileset_1.png");
        this.load.tilemapTiledJSON("level_1_map", "assets/maps/map_1.json");

        // sprites
        this.load.spritesheet("young_niccolo", "assets/entities/young_niccolo.png", { frameWidth: 32, frameHeight: 32 });

        // audio
        this.load.audio("level1", "assets/audio/level1.wav");
        this.load.audio("voice_a", "assets/audio/voices/voice1/voice_a.wav");
        this.load.audio("voice_e", "assets/audio/voices/voice1/voice_e.wav");
        this.load.audio("voice_i", "assets/audio/voices/voice1/voice_i.wav");
        this.load.audio("voice_o", "assets/audio/voices/voice1/voice_o.wav");
        this.load.audio("voice_u", "assets/audio/voices/voice1/voice_u.wav");
        
        // ui
        this.load.image("menu_box", "assets/ui/menu_box.png");
    }

    // cria elementos na tela
    create(data) {
        const spawnX = 32;
        const spawnY = 1024;

        // esc para abrir o pause
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.input.keyboard.on("keydown-ESC", () => {
            if(!this.canMove) return; 
            this.scene.pause();
            this.scene.launch("PauseMenu", { originScene: this.scene.key });
        });

        // config da musica
        this.bgMusic = this.sound.get("level1");
        if (!this.bgMusic) {
            this.bgMusic = this.sound.add("level1", { loop: true, volume: 0 });
        }

        this.dialogue = new DialogueManager(this);
        this.canMove = false;

        // carrega o mapa
        const map = this.make.tilemap({ key: "level_1_map" });
        const tileset = map.addTilesetImage("tileset_1", "tileset");

        const ground = map.createLayer("Tile Layer 3", tileset, 0, 0);
        
        // objetos interativos
        const objects = map.createLayer("Objetos", tileset, 0, 0);
        if (objects) {
            objects.setDepth(5);
            objects.setCollisionByExclusion([-1, 0]);
        }

        const walls = map.createLayer("Tile Layer 2", tileset, 0, 0);
        this.wallsLayer = walls;
        walls.setCollisionByExclusion([-1, 0]);

        // cria o player e colisao
        this.player = new Player(this, spawnX, spawnY, "young_niccolo");
        this.physics.add.collider(this.player, walls);
        if (objects) {
            this.physics.add.collider(this.player, objects);
        }

        // aviso de apertar e
         this.interactPrompt = this.add.bitmapText(0, 0, "pixelFont", "[E] Interagir", 16)
          .setOrigin(0.5, 1) 
          .setDepth(200)       
          .setVisible(false);  

        // tecla de interacao
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.interactCooldown = false;

        // animações da cena
        AnimationManager.createCharacterAnims(this, "young_niccolo");

        // camera seguindo player
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setRoundPixels(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys("W,A,S,D");

        // sistema de save inicial
        if (!data?.isRestart && !data?.fromSave) {
            SaveManager.save({
                level: "Level_1",
                playerX: spawnX,
                playerY: spawnY
            });
        }

        // carrega save
        if(data && data.fromSave) {
            const save = SaveManager.load();
            if (save) {
                this.player.setPosition(save.playerX, save.playerY);
            }
            if (!this.bgMusic.isPlaying) this.bgMusic.play();
            this.bgMusic.setVolume(0.5);
            this.canMove = true;
        }

        // reinicia cena
        if (data && data.isRestart) {
            if (!this.bgMusic.isPlaying) {
                this.bgMusic.play(); 
            }
            this.bgMusic.setVolume(0.5);
            this.canMove = true;
        }
    }

    // toca musica e texto inicial
    startCutscene() {
        if (!this.bgMusic.isPlaying) {
            this.bgMusic.play(); 
        }

        this.tweens.add({
            targets: this.bgMusic,
            volume: 0.5,
            duration: 4000,
        });

        this.time.delayedCall(2000, () => {
            this.showIntroText();
        });
    }

    // roda a cada frame
    update() {
        if (!this.canMove) return;
        
        this.player.update(this.cursors, this.keys, this.canMove);

        if (Phaser.Input.Keyboard.JustDown(this.keyE) && !this.interactCooldown) {
            this.tryInteract();
        }

        this.updatePrompts();
    }

    // mostra aviso de interacao
    updatePrompts() {
        // checar distancia de mecanismos futuramente
        this.interactPrompt.setVisible(false);
    }

    // interage com mecanismos
    tryInteract() {
        // abrir interface de desafios logicos
        this.interactCooldown = true;
        this.time.delayedCall(200, () => { this.interactCooldown = false; });
    }

    // texto inicial
    showIntroText() {
        const lines = [
        "> O mundo edsfsdf.",
        "> M=dsfdsf...",
        "> Sasd.",
        ];
        const text = lines.join("\n");

        this.dialogue.showDialogue(text, null, null, () => {
            this.canMove = true;
        });
    }
}