import path from 'path';
import fs from 'fs';

import archiver from 'archiver';

const pngPath = path.resolve('.', 'png');
const destinationPath = path.resolve('.', 'neobread.zip');

const output = fs.createWriteStream(destinationPath);
const archive = archiver('zip');

output.on('error', (err) => {
  throw err;
});

archive.pipe(output);

archive.directory(pngPath, false);

archive.finalize();
