import * as archiver from 'archiver';

export function createOneFileZip(sourcePath: string, sourceName: string, baseName: string, archive: archiver.Archiver) {
    // Create a folder inside the ZIP with the file name (without extension)
    archive.file(sourcePath, { name: `${baseName}/${sourceName}` });
}
