import Phaser from 'phaser';
import { Player } from '../entities/Player';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // 创建简单的图形代替图片资源
    this.make.graphics({ x: 0, y: 0 }).fillStyle(0x00ff00).fillRect(0, 0, 32, 32).generateTexture('player', 32, 32);
    this.make.graphics({ x: 0, y: 0 }).fillStyle(0x666666).fillRect(0, 0, 400, 32).generateTexture('platform', 400, 32);
  }

  create(): void {
    // 平台
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'platform');
    this.platforms.create(50, 250, 'platform');
    this.platforms.create(750, 220, 'platform');

    // 玩家
    this.player = new Player(this, 100, 450);
    this.physics.add.existing(this.player);

    // 碰撞
    this.physics.add.collider(this.player, this.platforms);

    // 键盘
    this.cursors = this.input.keyboard!.createCursorKeys();

    // 添加一些文本
    this.add.text(16, 16, '{{DISPLAY_NAME}}', {
      fontSize: '32px',
      color: '#ffffff',
    });

    this.add.text(16, 56, 'Use arrow keys to move', {
      fontSize: '16px',
      color: '#cccccc',
    });
  }

  update(time: number, delta: number): void {
    if (!this.player || !this.player.body || !this.cursors) return;

    const speed = 160;
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
