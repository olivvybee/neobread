import path from 'path';
import fs from 'fs';

const baseMeta = {
  metaVersion: 2,
  host: 'beehive.gay',
  exportedAt: new Date().toISOString(),
};

const pngDirectory = path.resolve('.', 'png');

if (!fs.existsSync(pngDirectory)) {
  throw new Error('png directory does not exist');
}

const filenames = fs
  .readdirSync(pngDirectory)
  .filter((filename) => filename.endsWith('.png'));

const emojis = filenames.map((filename) => {
  const name = filename.replace('.png', '');

  const firstUnderscore = name.indexOf('_');
  const category =
    firstUnderscore !== -1 ? name.slice(0, firstUnderscore) : name;

  return {
    downloaded: true,
    fileName: filename,
    emoji: {
      name,
      category,
      aliases: [],
    },
  };
});

const meta = {
  ...baseMeta,
  emojis,
};

const outPath = path.resolve(pngDirectory, 'meta.json');
fs.writeFileSync(outPath, JSON.stringify(meta, null, 2));
