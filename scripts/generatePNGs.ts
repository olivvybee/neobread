import path from 'path';
import fs from 'fs';

import yargs from 'yargs';
import cliProgress, { Presets } from 'cli-progress';

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

interface RunArgs {
  newOnly?: boolean;
}

const run = async ({ newOnly = false }: RunArgs) => {
  const svgDirectory = path.resolve('.', 'svg');
  const svgs = fs.readdirSync(svgDirectory);

  const pngDirectory = path.resolve('.', 'png');

  if (!fs.existsSync(pngDirectory)) {
    fs.mkdirSync(pngDirectory);
  }

  const existingPngs = fs
    .readdirSync(pngDirectory)
    .filter((filename) => filename.endsWith('.png'));

  const svgsToProcess = newOnly
    ? svgs.filter(
        (filename) => !existingPngs.includes(filename.replace('svg', 'png'))
      )
    : svgs;

  if (svgsToProcess.length === 0) {
    console.log('No new SVGs found to process.');
    return;
  }

  const progress = new cliProgress.MultiBar({}, Presets.shades_classic);
  const progressBar = progress.create(svgsToProcess.length, 0);

  for (let i = 0; i < svgsToProcess.length; i++) {
    const svgFilename = svgsToProcess[i];
    const svgPath = path.resolve(svgDirectory, svgFilename);
    const pngFilename = svgFilename.replace('svg', 'png');
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
    progress.log(`${svgFilename} -> ${pngFilename}\n`);
    progressBar.increment();
  }

  progress.remove(progressBar);
  progress.stop();
};

const argv = yargs(process.argv)
  .option('newOnly', {
    alias: 'n',
    type: 'boolean',
    description:
      "Only generate PNGs for SVGs that don't already have a PNG version",
  })
  .parseSync();

run(argv);
