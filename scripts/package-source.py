"""Create a source-only archive without credentials, host identity or user data."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parent.parent
output = root / 'public' / 'DiastiMed_RESOLVE_source.zip'
root_files = ['README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'AI_USE.md',
              'package.json', 'package-lock.json', 'tsconfig.json', 'index.html', '.gitignore']
directories = ['src', 'tests', 'scripts', 'docs', '.github']
files = [root / name for name in root_files]
for directory in directories:
    files.extend(p for p in (root / directory).rglob('*') if p.is_file()
                 and '__pycache__' not in p.parts and p.suffix != '.pyc')
files.extend(root / name for name in ['public/development-credits.json', 'public/sw.js', 'public/benchmark.json', 'public/AI_USE.md', 'public/judging.html', 'public/DiastiMed_RESOLVE_judging.pdf', 'public/DiastiMed_RESOLVE_judging.pptx'])
files.extend(p for p in (root / 'public' / 'sensitivity').glob('*') if p.is_file())
files.extend(p for p in (root / 'public' / 'judging').glob('*') if p.is_file())
files.extend(p for p in (root / 'public' / 'assets').rglob('*') if p.is_file())
missing = [str(p.relative_to(root)) for p in files if not p.exists()]
if missing:
    raise SystemExit('Missing required source files: ' + ', '.join(missing))
manifest = {'format': 1, 'project': 'DiastiMed RESOLVE', 'files': {}}
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(set(files)):
        name = path.relative_to(root).as_posix()
        data = path.read_bytes()
        manifest['files'][name] = hashlib.sha256(data).hexdigest()
        info = zipfile.ZipInfo('DiastiMed_RESOLVE/' + name, date_time=(2026, 11, 14, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        archive.writestr(info, data)
    archive.writestr('DiastiMed_RESOLVE/SOURCE_MANIFEST.json', json.dumps(manifest, indent=2))
print(f'Packaged {len(manifest["files"])} files: {output}')
