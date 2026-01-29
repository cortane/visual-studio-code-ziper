import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

export function createFolderZip(sourcePath: string, sourceName: string, archive: archiver.Archiver) {
    archive.directory(sourcePath, sourceName);
}
