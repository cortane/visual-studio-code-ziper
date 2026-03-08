import * as vscode from 'vscode';
import AdmZip from 'adm-zip';
import * as path from 'path';
import * as fs from 'fs';
import { showSuccessMessage, showErrorMessage } from './error_and_message_display';
import { showProgress } from './progress_display';
import { assertUri } from './assert_uri';

export async function unzipCommand(uri: vscode.Uri) {
    try {
        assertUri(uri, 'No ZIP file selected.');
    } catch (error: unknown) {
        showErrorMessage(error instanceof Error ? error.message : String(error));
        return;
    }

    const zipPath = uri.fsPath;
    const dirPath = path.dirname(zipPath);
    const zipName = path.basename(zipPath, '.zip');
    const extractPath = path.join(dirPath, zipName);

    if (fs.existsSync(extractPath)) {
        const choice = await vscode.window.showWarningMessage(
            `Folder "${zipName}" already exists. Overwrite?`,
            'Yes',
            'No'
        );
        if (choice !== 'Yes') {
            return;
        }
    }

    try {
        await showProgress('Extracting ZIP file...', async (progress) => {
            const zip = new AdmZip(zipPath);
            const normalizedExtractPath = path.resolve(extractPath);
            const entries = zip.getEntries();

            // Zip Slip 保護: 全エントリのパスを事前検証
            for (const entry of entries) {
                const resolvedPath = path.resolve(extractPath, entry.entryName);
                if (resolvedPath !== normalizedExtractPath && !resolvedPath.startsWith(normalizedExtractPath + path.sep)) {
                    throw new Error('Invalid ZIP entry detected: potential Zip Slip attack');
                }
            }

            // エントリごとに展開し進捗を報告
            const totalEntries = entries.length;
            let processed = 0;

            for (const entry of entries) {
                zip.extractEntryTo(entry, extractPath, true, true);
                processed++;
                progress.report({ message: `${processed}/${totalEntries} entries` });
            }
        });

        showSuccessMessage(`Successfully extracted to ${extractPath}`);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        showErrorMessage(`Failed to extract ZIP: ${message}`);
    }
}