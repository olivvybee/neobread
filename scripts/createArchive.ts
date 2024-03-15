import path from 'path';
import fs from 'fs';

import archiver from 'archiver';

const createZipFromDirectory = (inPath: string, outPath: string) => {
  const output = fs.createWriteStream(outPath);
  const archive = archiver('zip');

  output.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  archive.directory(inPath, false);

  archive.finalize();
};

createZipFromDirectory(
  path.resolve('.', 'png'),
  path.resolve('.', 'neobread.zip')
);
createZipFromDirectory(
  path.resolve('.', 'svg'),
  path.resolve('.', 'neobread-svg.zip')
);
