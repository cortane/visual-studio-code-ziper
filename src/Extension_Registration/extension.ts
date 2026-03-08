import * as vscode from 'vscode';
import { unzipCommand } from '../commands/unzip';
import * as path from 'path';
import { createFolderZip } from '../commands/folderzip';
import { createOneFileZip } from '../commands/onefilezip';
import { showProgress } from '../commands/progress_display';
import { showSuccessMessage, showErrorMessage } from '../commands/error_and_message_display';
import { createArchive } from '../commands/create_archive';
import { assertUri } from '../commands/assert_uri';
import { verifyZipIntegrity } from '../commands/compression_utils';

async function zipCommand(uri: vscode.Uri) {
    try {
        assertUri(uri);
    } catch (error: unknown) {
        showErrorMessage(error instanceof Error ? error.message : String(error));
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
        await vscode.workspace.fs.stat(vscode.Uri.file(zipPath));
        showErrorMessage('ZIP file already exists.');
        return;
    } catch {
        // ZIP file does not exist, proceed
    }

    try {
        await showProgress('Creating ZIP file...', async (progress) => {
            const { archive, output } = createArchive(zipPath);

            // ストリーム完了を待つ Promise
            const closePromise = new Promise<void>((resolve, reject) => {
                output.on('close', resolve);
                output.on('error', reject);
                archive.on('error', (err: Error) => {
                    output.destroy();
                    reject(err);
                });
            });

            archive.on('progress', (progressData: { entries: { processed: number; total: number }; fs: { processedBytes: number; totalBytes: number } }) => {
                progress.report({ message: `${progressData.entries.processed} files processed` });
            });

            if (isDirectory) {
                await createFolderZip(sourcePath, archive);
            } else {
                createOneFileZip(sourcePath, sourceName, baseName, archive);
            }

            await archive.finalize();
            await closePromise;

            // ZIP 整合性チェック（非同期ストリーム検証）
            progress.report({ message: 'Verifying...' });
            await verifyZipIntegrity(zipPath);
        });

        showSuccessMessage(`Successfully created ${zipPath}`);
    } catch (error: unknown) {
        try {
            await vscode.workspace.fs.delete(vscode.Uri.file(zipPath));
        } catch {
            // Ignore cleanup errors
        }
        const message = error instanceof Error ? error.message : String(error);
        showErrorMessage(`Failed to create ZIP: ${message}`);
    }
}

export function activate(context: vscode.ExtensionContext) {
    const zipDisposable = vscode.commands.registerCommand('zipExplorer.zip', zipCommand);
    const unzipDisposable = vscode.commands.registerCommand('zipExplorer.unzip', unzipCommand);

    context.subscriptions.push(zipDisposable, unzipDisposable);
}
