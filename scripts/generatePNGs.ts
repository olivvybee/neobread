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
  size: number;
  outdir: string;
}

const DEFAULT_SIZE = 256;
const DEFAULT_DIR = path.resolve('.', 'png');

const run = async ({
  newOnly = false,
  size = DEFAULT_SIZE,
  outdir = DEFAULT_DIR,
}: RunArgs) => {
  const svgDirectory = path.resolve('.', 'svg');
  const svgs = fs
    .readdirSync(svgDirectory)
    .filter((filename) => filename.endsWith('.svg'));

  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir);
  }

  const existingPngs = fs
    .readdirSync(outdir)
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
    const pngPath = path.resolve(outdir, pngFilename);

    const buffer = await svg2img(svgPath, {
      resvg: {
        fitTo: {
          mode: 'width',
          value: size,
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
  .option('size', {
    alias: 's',
    type: 'number',
    description: 'The size to generate PNGs at, in pixels',
    default: DEFAULT_SIZE,
  })
  .option('outdir', {
    alias: 'o',
    type: 'string',
    description: 'Output directory to save PNGs into',
    default: DEFAULT_DIR,
  })
  .parseSync();

run(argv);
