// VSIXにREADME.mdを通常ファイルとして注入する
// (vsceはREADMEをギャラリーアセットとして扱い、VS Codeがディスクに展開しないため)
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const vsixGlob = fs.readdirSync(root).filter(f => f.endsWith('.vsix'));
if (vsixGlob.length === 0) { console.error('No .vsix found'); process.exit(1); }

const vsixPath = path.join(root, vsixGlob[0]);
const readmePath = path.join(root, 'docs', 'README.md');

const zip = new AdmZip(vsixPath);
zip.addFile('extension/README.md', fs.readFileSync(readmePath));
zip.writeZip(vsixPath);
console.log(`Injected README.md into ${path.basename(vsixPath)}`);
