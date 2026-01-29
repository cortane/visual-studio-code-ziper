# Visual Studio Code Ziper

[![Visual Studio Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue)](https://marketplace.visualstudio.com/)

VS Codeのエクスプローラーでフォルダーやファイルを右クリックするだけでZIP圧縮・解凍ができる拡張機能です。面倒なディレクトリ移動やコマンドライン操作は不要で、直感的な操作でZIPファイルの作成・展開が可能です。

## 機能

- **簡単ZIP作成**: エクスプローラーでフォルダーやファイルを右クリックして「ZIP」を選択
- **スマートなファイル構造**: 単一ファイルのZIP作成時は、解凍時に同名のフォルダー内に配置
- **安全な解凍**: ZIPファイルを右クリックして「Unzip」で安全に展開
- **進捗表示**: 大きなファイルの処理時にリアルタイムで進捗を表示
- **セキュリティ対策**: Zip Slip攻撃に対する保護を実装
- **上書き防止**: 既存ファイルの上書きを防ぐ安全設計

## インストール

1. VS Codeを開く
2. 拡張機能タブ（Ctrl+Shift+X）で「Visual Studio Code Ziper」を検索
3. 「インストール」ボタンをクリック

または、[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/) から直接インストールしてください。

## 使い方

### ZIPファイルの作成

1. **エクスプローラーで対象を選択**
   - フォルダーまたはファイルを右クリック

2. **「ZIP」を選択**
   - コンテキストメニューから「ZIP」をクリック

3. **完了を待つ**
   - 進捗通知が表示され、処理が完了すると成功メッセージが表示されます

**例:**
- `myfolder/` → `myfolder.zip`
- `document.txt` → `document.zip`（解凍時は `document/` フォルダー内に配置）

### ZIPファイルの解凍

1. **ZIPファイルを右クリック**
2. **「Unzip」を選択**
3. **展開先の確認**
   - 同名のフォルダーが存在する場合、上書き確認ダイアログが表示されます

**例:**
- `archive.zip` → `archive/` フォルダーに展開

## 要件

- **VS Code**: 1.108.1 以上
- **Node.js**: 拡張機能の実行には不要（VS Codeに同梱）
- **OS**: Windows, macOS, Linux 対応

## 既知の問題と注意事項

- **大容量フォルダーの処理**: 大きなフォルダーをZIP圧縮する場合、処理に時間がかかる可能性があります
- **Extension Hostの負荷**: 大容量データの処理中、VS CodeのExtension Hostが一時的に重くなる場合があります
- **既存ファイルの上書き**: ZIP作成時は既存のZIPファイルが存在する場合、エラーが表示されます

## 開発・貢献

この拡張機能はオープンソースです。バグ報告や機能リクエストは [GitHub Issues](https://github.com/your-repo/issues) からお願いします。

### 開発環境のセットアップ

```bash
git clone https://github.com/your-repo/visual-studio-code-ziper.git
cd visual-studio-code-ziper
npm install
npm run compile
```

### テスト

```bash
npm run compile
code --install-extension visual-studio-code-ziper-0.0.1.vsix
```

## リリースノート

### 0.0.1 (2026-01-29)
- 初期リリース
- ZIP圧縮・解凍機能の実装
- 進捗表示とエラーハンドリング
- セキュリティ対策（Zip Slip保護）

## ライセンス

この拡張機能は MIT ライセンスの下で公開されています。

---

**開発者**: [Your Name]  
**リポジトリ**: [GitHub Repository URL]  
**Marketplace**: [VS Code Marketplace URL]

ご質問やフィードバックは [GitHub Issues](https://github.com/your-repo/issues) までお願いします！
