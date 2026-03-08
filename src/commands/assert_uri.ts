import * as vscode from 'vscode';

export function assertUri(uri: vscode.Uri | undefined, message: string = 'No resource selected.'): asserts uri is vscode.Uri {
    if (!uri) {
        throw new Error(message);
    }
}
