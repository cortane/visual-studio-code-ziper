import * as vscode from 'vscode';
const AdmZip = require('adm-zip');
import * as path from 'path';
import * as fs from 'fs';
import { showSuccessMessage, showErrorMessage } from './error_and_message_display';

function assertUri(uri: vscode.Uri | undefined): asserts uri is vscode.Uri {
    if (!uri) {
        throw new Error('No ZIP file selected.');
    }
}

export async function unzipCommand(uri: vscode.Uri) {
    try {
        assertUri(uri);
    } catch (error: any) {
        showErrorMessage(error.message);
        return;
    }

    const zipPath = uri.fsPath;
    const dirPath = path.dirname(zipPath);
    const zipName = path.basename(zipPath, '.zip');
    const extractPath = path.join(dirPath, zipName);

    // Check if extract path already exists
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
        const zip = new AdmZip(zipPath);

        // Zip Slip protection
        const entries = zip.getEntries();
        for (const entry of entries) {
            const resolvedPath = path.resolve(extractPath, entry.entryName);
            if (!resolvedPath.startsWith(extractPath + path.sep)) {
                throw new Error('Invalid ZIP entry detected: potential Zip Slip attack');
            }
        }

        zip.extractAllTo(extractPath, true);
        showSuccessMessage(`Successfully extracted to ${extractPath}`);
    } catch (error: any) {
        showErrorMessage(`Failed to extract ZIP: ${error}`);
    }
}