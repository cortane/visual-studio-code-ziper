import * as archiver from 'archiver';
import * as path from 'path';

export function createFolderZip(sourcePath: string, archive: archiver.Archiver) {
    const sourceName = path.basename(sourcePath);
    archive.directory(sourcePath, sourceName);
}
