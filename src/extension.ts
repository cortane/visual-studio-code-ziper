// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const archiver = require('archiver');
const AdmZip = require('adm-zip');
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "zip-explorer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('zipExplorer.zip', async (uri: vscode.Uri) => {
		if (!uri) {
			vscode.window.showErrorMessage('No resource selected.');
			return;
		}

		const stat = await vscode.workspace.fs.stat(uri);
		const isDirectory = stat.type === vscode.FileType.Directory;
		const sourcePath = uri.fsPath;
		const sourceName = path.basename(sourcePath);
		const dirPath = path.dirname(sourcePath);
		const baseName = isDirectory ? sourceName : path.parse(sourceName).name;
		const zipPath = path.join(dirPath, `${baseName}.zip`);

		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: 'Creating ZIP file...',
			cancellable: false
		}, async (progress) => {
			return new Promise<void>((resolve, reject) => {
				try {
					const output = fs.createWriteStream(zipPath);
					const archive = archiver('zip', {
						zlib: { level: 9 }
					});

					output.on('close', () => {
						vscode.window.showInformationMessage(`Successfully created ${zipPath}`);
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
						archive.directory(sourcePath, sourceName);
					} else {
						// Create a folder inside the ZIP with the file name (without extension)
						archive.file(sourcePath, { name: path.join(baseName, sourceName) });
					}

					archive.finalize();
				} catch (error) {
					reject(error);
				}
			}).catch((error: any) => {
				vscode.window.showErrorMessage(`Failed to create ZIP: ${error}`);
			});
		});
	});

	context.subscriptions.push(disposable);

	const unzipDisposable = vscode.commands.registerCommand('zipExplorer.unzip', async (uri: vscode.Uri) => {
		if (!uri) {
			vscode.window.showErrorMessage('No ZIP file selected.');
			return;
		}

		const zipPath = uri.fsPath;
		const dirPath = path.dirname(zipPath);
		const zipName = path.basename(zipPath, '.zip');
		const extractPath = path.join(dirPath, zipName);

		try {
			const zip = new AdmZip(zipPath);
			zip.extractAllTo(extractPath, true);
			vscode.window.showInformationMessage(`Successfully extracted to ${extractPath}`);
		} catch (error: any) {
			vscode.window.showErrorMessage(`Failed to extract ZIP: ${error}`);
		}
	});

	context.subscriptions.push(unzipDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
