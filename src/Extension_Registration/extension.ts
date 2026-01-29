// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { unzipCommand } from '../commands/unzip';
const archiver = require('archiver');
import * as fs from 'fs';
import * as path from 'path';
import { createFolderZip } from '../commands/folderzip';
import { createOneFileZip } from '../commands/onefilezip';
import { showProgress } from '../commands/progress_display';
import { showSuccessMessage, showErrorMessage } from '../commands/error_and_message_display';

async function zipCommand(uri: vscode.Uri) {
    if (!uri) {
        showErrorMessage('No resource selected.');
        return;
    }

    const stat = await vscode.workspace.fs.stat(uri);
    const isDirectory = stat.type === vscode.FileType.Directory;
    const sourcePath = uri.fsPath;
    const sourceName = path.basename(sourcePath);
    const dirPath = path.dirname(sourcePath);
    const baseName = isDirectory ? sourceName : path.parse(sourceName).name;
    const zipPath = path.join(dirPath, `${baseName}.zip`);

    try {
        await showProgress('Creating ZIP file...', async (progress) => {
            return new Promise<void>((resolve, reject) => {
                const output = fs.createWriteStream(zipPath);
                const archive = archiver('zip', {
                    zlib: { level: 9 }
                });

                output.on('close', () => {
                    showSuccessMessage(`Successfully created ${zipPath}`);
                    resolve();
                });

                archive.on('error', (err: any) => {
                    reject(err);
                });

                archive.on('progress', (progressData: any) => {
                    progress.report({ message: `${progressData.entries.processed} files processed` });
                });

                archive.pipe(output);

                if (isDirectory) {
                    createFolderZip(sourcePath, sourceName, archive);
                } else {
                    createOneFileZip(sourcePath, sourceName, baseName, archive);
                }

                archive.finalize();
            });
        });
    } catch (error: any) {
        showErrorMessage(`Failed to create ZIP: ${error}`);
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "visual-studio-code-ziper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const zipDisposable = vscode.commands.registerCommand('zipExplorer.zip', zipCommand);
	const unzipDisposable = vscode.commands.registerCommand('zipExplorer.unzip', unzipCommand);

	context.subscriptions.push(zipDisposable);
	context.subscriptions.push(unzipDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
