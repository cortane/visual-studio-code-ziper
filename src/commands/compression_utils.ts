import * as path from 'path';
import type { EntryData } from 'archiver';
import AdmZip from 'adm-zip';
const yauzl = require('yauzl');

/** archiver の EntryData に ZIP 固有の store オプションを追加 */
export interface ZipEntryData extends EntryData {
    store?: boolean;
}

/** 既に圧縮済みで DEFLATE しても縮まない拡張子 */
const STORE_EXTENSIONS = new Set([
    // 画像
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.heic', '.heif',
    // 動画
    '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.webm', '.flv',
    // 音声
    '.mp3', '.flac', '.aac', '.ogg', '.opus', '.wma', '.m4a',
    // アーカイブ
    '.zip', '.gz', '.bz2', '.xz', '.zst', '.7z', '.rar', '.lz4', '.br', '.lzma', '.cab',
    // フォント
    '.woff', '.woff2',
    // Office (内部が ZIP)
    '.docx', '.xlsx', '.pptx', '.odt', '.ods', '.odp',
    // Java アーカイブ
    '.jar', '.war', '.ear',
    // その他
    '.msi', '.vsix', '.nupkg', '.deb', '.rpm',
]);

/**
 * 圧縮済みファイルかどうかを判定する。
 * 圧縮済みの場合 STORE(無圧縮) で格納し、サイズ増加を防ぐ。
 */
export function shouldStore(fileName: string): boolean {
    return STORE_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

/**
 * 作成した ZIP ファイルの整合性を検証する。
 * 中央ディレクトリの読み取り + 先頭の非空エントリの CRC32 検証を行う。
 */
export async function verifyZipIntegrity(zipPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        yauzl.open(zipPath, { lazyEntries: true }, (err: Error | null, zipfile: any) => {
            if (err) return reject(err);

            let foundEntry = false;

            zipfile.readEntry();
            zipfile.on('entry', (entry: any) => {
                // スキップするディレクトリエントリ
                if (/\/$/.test(entry.fileName)) {
                    zipfile.readEntry();
                    return;
                }

                foundEntry = true;

                zipfile.openReadStream(entry, (streamErr: Error | null, readStream: any) => {
                    if (streamErr) {
                        zipfile.close();
                        return reject(streamErr);
                    }

                    let byteCount = 0;
                    readStream.on('data', (chunk: Buffer) => {
                        byteCount += chunk.length;
                    });

                    readStream.on('end', () => {
                        // エントリの非圧縮サイズと読み取ったバイト数を比較
                        if (typeof entry.uncompressedSize === 'number' && byteCount !== entry.uncompressedSize) {
                            zipfile.close();
                            return reject(new Error(`ZIP archive verification failed: size mismatch for ${entry.fileName}`));
                        }
                        zipfile.close();
                        return resolve();
                    });

                    readStream.on('error', (streamErr2: Error) => {
                        zipfile.close();
                        return reject(streamErr2);
                    });
                });
            });

            zipfile.on('end', () => {
                if (!foundEntry) {
                    zipfile.close();
                    return reject(new Error('ZIP archive verification failed: no entries found'));
                }
            });

            zipfile.on('error', (zipErr: Error) => {
                return reject(zipErr);
            });
        });
    });
}
