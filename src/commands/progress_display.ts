import * as vscode from 'vscode';

export async function showProgress<T>(
    title: string,
    task: (progress: vscode.Progress<{ message?: string }>) => Promise<T>
): Promise<T> {
    return vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title,
        cancellable: false
    }, task);
}
