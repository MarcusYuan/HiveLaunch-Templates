import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    // UI 层 - 分数、生命值等
    // 这是一个覆盖在游戏场景上的独立场景
  }
}
