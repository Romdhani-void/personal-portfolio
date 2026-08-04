from pathlib import Path

root = Path('.').resolve()
out = root / 'all_files_clean.txt'
text_exts = {'.txt', '.ts', '.html', '.css', '.json', '.js', '.svg', '.dockerignore', '.gitignore', '.gitattributes', '.editorconfig', '.vercelignore'}

if out.exists():
    out.unlink()

files = []
for p in root.rglob('*'):
    if p.is_file() and '.git' not in p.parts:
        if p.name.startswith('all_files'):
            continue
        if p.suffix.lower() in text_exts or p.suffix == '':
            files.append(p)

files.sort()
with out.open('w', encoding='utf-8', errors='replace') as f:
    for p in files:
        f.write(f'====== FILE: {p.resolve()} ======\n\n')
        try:
            text = p.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            text = p.read_text(encoding='utf-8', errors='replace')
        f.write(text)
        if not text.endswith('\n'):
            f.write('\n')
        f.write('\n\n')

print(f'Created {out} with {len(files)} files and {sum(1 for _ in out.open(encoding="utf-8"))} lines.')