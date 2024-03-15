import path from 'path';
import fs from 'fs';

import svg2imgWithCallback, { svg2imgOptions } from 'svg2img';

const svg2img = (svg: string, options?: svg2imgOptions): Promise<any> =>
  new Promise((resolve, reject) =>
    svg2imgWithCallback(svg, options, (err, buffer) => {
      if (err) {
        reject(err);
      }
      resolve(buffer);
    })
  );

const run = async () => {
  const svgDirectory = path.resolve('.', 'svg');
  const svgs = fs.readdirSync(svgDirectory);

  const pngDirectory = path.resolve('.', 'png');

  if (!fs.existsSync(pngDirectory)) {
    fs.mkdirSync(pngDirectory);
  }

  await Promise.all(
    svgs.map(async (filename) => {
      const svgPath = path.resolve(svgDirectory, filename);
      const pngFilename = filename.replace('svg', 'png');
      const pngPath = path.resolve(pngDirectory, pngFilename);

      const buffer = await svg2img(svgPath, {
        resvg: {
          fitTo: {
            mode: 'width',
            value: 256,
          },
        },
      });

      fs.writeFileSync(pngPath, buffer);
    })
  );
};

run();
