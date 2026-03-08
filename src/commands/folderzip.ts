import * as archiver from 'archiver';
import * as path from 'path';
import * as fs from 'fs/promises';
import { shouldStore } from './compression_utils';
import type { ZipEntryData } from './compression_utils';

export async function createFolderZip(sourcePath: string, archive: archiver.Archiver) {
    const sourceName = path.basename(sourcePath);
    await addDirectoryToArchive(sourcePath, sourceName, archive);
}

async function addDirectoryToArchive(dirPath: string, prefix: string, archive: archiver.Archiver) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    // 空フォルダを保持する
    if (entries.length === 0) {
        archive.append('', { name: prefix + '/' });
        return;
    }

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const archivePath = prefix + '/' + entry.name;

        if (entry.isSymbolicLink()) {
            // シンボリックリンクはリンク先の実体を辿って追加
            const stat = await fs.stat(fullPath);
            if (stat.isDirectory()) {
                await addDirectoryToArchive(fullPath, archivePath, archive);
            } else if (stat.isFile()) {
                const data: ZipEntryData = { name: archivePath, store: shouldStore(entry.name) };
                archive.file(fullPath, data);
            }
        } else if (entry.isDirectory()) {
            await addDirectoryToArchive(fullPath, archivePath, archive);
        } else if (entry.isFile()) {
            const data: ZipEntryData = { name: archivePath, store: shouldStore(entry.name) };
            archive.file(fullPath, data);
        }
    }
}
