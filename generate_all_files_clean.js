const fs = require('fs');
const path = require('path');

const root = path.resolve('.');
const outPath = path.join(root, 'all_files_clean.txt');
const textExts = new Set(['.txt', '.ts', '.html', '.css', '.json', '.js', '.svg', '.dockerignore', '.gitignore', '.gitattributes', '.editorconfig', '.vercelignore']);

if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git') continue;
      walk(fullPath);
    } else if (entry.isFile()) {
      if (entry.name.startsWith('all_files')) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '' || textExts.has(ext)) {
        files.push(fullPath);
      }
    }
  }
}

const files = [];
walk(root);
files.sort();

const outStream = fs.createWriteStream(outPath, { encoding: 'utf8' });
for (const fullPath of files) {
  outStream.write(`====== FILE: ${fullPath} ======\n\n`);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    outStream.write(content);
  } catch (err) {
    const content = fs.readFileSync(fullPath, 'utf8');
    outStream.write(content);
  }
  if (!fs.readFileSync(fullPath, 'utf8').endsWith('\n')) {
    outStream.write('\n');
  }
  outStream.write('\n\n');
}
outStream.end();
outStream.on('finish', () => {
  const lineCount = fs.readFileSync(outPath, 'utf8').split(/\r?\n/).length;
  console.log(`Created ${outPath} with ${files.length} files and ${lineCount} lines.`);
});