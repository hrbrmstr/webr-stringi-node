#!/usr/bin/env node

const path = require('path');
const wordwrap = require('wordwrapjs');

const { loadPackages } = require('webrtools');
const { WebR } = require('webr');

const wrapLen = 60;
const nIpsum = (process.argv[2]) ? +process.argv[2] : 1

const webR = new WebR();

(async () => {
  await webR.init();

  globalThis.webR = webR; // webrtools needs this
  
  await loadPackages(webR, path.join(__dirname, 'webr_packages'))
  
  await webR.evalR("library(stringi)");
  
  let result = await webR.evalR(`stri_rand_lipsum(${nIpsum})`);

  try {
    let output = (await result.toArray())
      .map(d => wordwrap.wrap(d, { width: wrapLen }))
      .join("\n\n");
    process.stdout.write(output)
  } finally {
    webR.destroy(result);
  }
  
  process.exit(0);

})();
