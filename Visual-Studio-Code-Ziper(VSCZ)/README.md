# ZIP Explorer

この拡張機能は、VS Codeのエクスプローラーでフォルダーやファイルを右クリックしたときに表示されるコンテキストメニューに「ZIP」オプションを追加します。また、ZIPファイルを右クリックして「Unzip」オプションで解凍できます。

## 機能

- エクスプローラーのコンテキストメニューに「ZIP」項目を追加
- フォルダーまたはファイルをZIP圧縮
- ファイル単体のZIPの場合、ファイル名（拡張子除く）.zip として作成し、解凍すると同名のフォルダー内にファイルが配置される
- ZIPファイルを解凍
- 進捗表示付きで処理

## 使い方

### ZIP作成
1. VS Codeのエクスプローラーでフォルダーまたはファイルを右クリック
2. 「ZIP」を選択
3. 進捗通知が表示され、ZIPファイルが作成されます

### ZIP解凍
1. ZIPファイルを右クリック
2. 「Unzip」を選択
3. 同じディレクトリに解凍されます

## 要件

- Node.js と npm がインストールされていること
- VS Code 1.108.1 以上

## 既知の問題

- 大きなフォルダーのZIP作成は時間がかかる場合があります

## リリースノート

### 0.0.1

初期リリース

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
