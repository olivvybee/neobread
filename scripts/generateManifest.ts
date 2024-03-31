import path from 'path';
import fs from 'fs';
import { argv } from 'process';

const checksum = argv[2];
if (!checksum) {
  throw new Error('No checksum provided');
}

const pngDirectory = path.resolve('.', 'png');

if (!fs.existsSync(pngDirectory)) {
  throw new Error('png directory does not exist');
}

const filenames = fs
  .readdirSync(pngDirectory)
  .filter((filename) => filename.endsWith('.png'));

const fileMap = filenames.reduce((processed, filename) => {
  const name = filename.replace('.png', '');
  return {
    ...processed,
    [name]: filename,
  };
}, {});

const fileMapOutput = path.resolve('.', 'filemap.json');
fs.writeFileSync(fileMapOutput, JSON.stringify(fileMap, null, 2));

const manifest = {
  neobread: {
    description: 'Bread emojis by @olivvybee@honeycomb.engineer',
    files:
      'https://github.com/olivvybee/neobread/releases/latest/download/filemap.json',
    homepage: 'https://github.com/olivvybee/neobread/',
    src: 'https://github.com/olivvybee/neobread/releases/latest/download/neobread.zip',
    src_sha256: checksum,
    license: 'CC BY-NC-SA 4.0',
  },
};

const manifestOutput = path.resolve('.', 'manifest.json');
fs.writeFileSync(manifestOutput, JSON.stringify(manifest, null, 2));
