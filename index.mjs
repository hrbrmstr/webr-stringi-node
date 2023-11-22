#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path'
import { WebR } from 'webr'
import { loadPackages } from './src/webrtools.mjs';
import { default as wordwrap } from './node_modules/wordwrapjs/dist/index.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const wrapLen = 60;
const nIpsum = (process.argv[2]) ? +process.argv[2] : 1

const webR = new WebR();

await webR.init();

globalThis.webR = webR; // webrtools needs this
  
await loadPackages(webR, path.join(__dirname, 'webr_packages'))

await webR.evalR("library(stringi)");
  
let result = await webR.evalR(`stri_rand_lipsum(${nIpsum})`);

try {
  let output = (await result.toArray())
    .map(d => wordwrap.wrap(d, { width: wrapLen }))
    .join("\n\n");
  process.stdout.write(output + "\n")
} finally {
  webR.destroy(result);
}
  
process.exit(0);
