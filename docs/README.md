# Visual Studio Code Ziper

> Right-click. Compress. Done.

VS Code のエクスプローラー上で右クリックするだけで ZIP 圧縮・解凍ができる拡張機能です。
コマンドライン操作は一切不要。直感的な操作で ZIP ファイルの作成・展開が可能です。

---

## Features

### ZIP 圧縮

- エクスプローラーで対象を右クリック → 「ZIP」を選択
- フォルダー構造を完全保持（空フォルダー含む）
- 圧縮済みファイル（.jpg .png .mp4 等）は無圧縮（STORE）
- 作成後に自動で ZIP 整合性検証を実行

### ZIP 解凍

- ZIP ファイルを右クリック → 「Unzip」を選択
- エントリごとの進捗表示あり
- Zip Slip 攻撃に対する保護
- 同名フォルダーがある場合は上書き確認ダイアログ

---

## Usage

### ZIP 作成

1. エクスプローラーで対象を右クリック
2. コンテキストメニューから「ZIP」を選択
3. 進捗通知が表示され、完了後に成功メッセージが表示

```
myfolder/      -->  myfolder.zip
document.txt   -->  document.zip  (解凍時: document/document.txt)
```

### ZIP 解凍

1. ZIP ファイルを右クリック
2. 「Unzip」を選択
3. 同じディレクトリに展開されます

```
archive.zip  -->  archive/
```

---

## Smart Compression

ファイルごとに最適な圧縮方式を自動選択します。

```
テキスト   (.txt .json .xml ...)   DEFLATE  最大圧縮
画像       (.jpg .png .webp ...)   STORE    無圧縮
動画       (.mp4 .mkv .avi ...)    STORE    無圧縮
音声       (.mp3 .flac .aac ...)   STORE    無圧縮
アーカイブ (.zip .gz .7z ...)      STORE    無圧縮
```

既に圧縮されているファイルを DEFLATE すると逆にサイズが増加します。
STORE を使うことで、Windows 標準 ZIP と同等以上の圧縮効率を実現します。

---

## Security

- Zip Slip 攻撃保護 — 展開先パスの事前検証
 - ZIP 整合性検証 — 作成後にエントリサイズの検証を行う（基本的な整合性チェック）
- エラー時クリーンアップ — 失敗時に壊れた ZIP を自動削除
- 上書き防止 — 既存ファイルへの意図しない上書きをブロック

---

## Requirements

- VS Code 1.108.1 以上
- OS: Windows / macOS / Linux
- Node.js 不要（VS Code に同梱）

---

## Release Notes

### v0.0.2

- 圧縮率の改善（圧縮済みファイルの STORE 自動判定）
- 空フォルダーの保持
- シンボリックリンク対応
- ZIP 整合性検証の追加
- 解凍時の進捗表示
- 非同期 I/O によるパフォーマンス改善
 - VSIX サイズの大幅削減（例: 1.33MB → 311KB、ビルド時の値はバージョン/ビルド環境により変動します）
- コード品質の全面的な改善

### v0.0.1

- 初期リリース

---

## Implementation notes

- `verifyZipIntegrity()` は作成後に ZIP のエントリを読み取り、エントリサイズの一致を確認する同期的な簡易整合性チェックを行います。大きな ZIP を扱う場合はブロッキングを避けるためにストリームベースの非同期検証や CRC32 検証の導入を検討してください。

## FAQ

- Q: ローカルで `.vsix` をインストールしたときに拡張機能の詳細ページに README が表示されません。なぜですか？
	- A: VS Code の挙動により、Marketplace（ギャラリー）用の README アセットは拡張ページに表示されますが、ローカルインストール時に必ずしも自動で展開・表示されない場合があります。Marketplace に公開すると README は確実に表示されます。ローカルで表示させたい場合は、拡張機能フォルダに手動で `README.md` を置くか、パッケージング時に README を通常ファイルとして含める手順を行ってください（本プロジェクトでは `build/inject-readme.js` を用意しています）。

---

Visual Studio Code Ziper — Copyright (c) 2026
