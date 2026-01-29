import * as vscode from 'vscode';
const AdmZip = require('adm-zip');
import * as path from 'path';
import { showSuccessMessage, showErrorMessage } from './error_and_message_display';

export async function unzipCommand(uri: vscode.Uri) {
    if (!uri) {
        showErrorMessage('No ZIP file selected.');
        return;
    }

    const zipPath = uri.fsPath;
    const dirPath = path.dirname(zipPath);
    const zipName = path.basename(zipPath, '.zip');
    const extractPath = path.join(dirPath, zipName);

    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);
        showSuccessMessage(`Successfully extracted to ${extractPath}`);
    } catch (error: any) {
        showErrorMessage(`Failed to extract ZIP: ${error}`);
    }
}