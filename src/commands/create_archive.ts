const archiver = require('archiver');
import * as fs from 'fs';

export function createArchive(outputPath: string) {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    archive.pipe(output);
    return { archive, output };
}