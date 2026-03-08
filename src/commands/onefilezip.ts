import * as archiver from 'archiver';
import { shouldStore } from './compression_utils';
import type { ZipEntryData } from './compression_utils';

export function createOneFileZip(sourcePath: string, sourceName: string, baseName: string, archive: archiver.Archiver) {
    const data: ZipEntryData = { name: `${baseName}/${sourceName}`, store: shouldStore(sourceName) };
    archive.file(sourcePath, data);
}
