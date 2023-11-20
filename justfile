# use this to bootstrap available packages
pkgs:
  Rscript ./node_modules/webrtools/r/install.R stringi

# run this script
@run:
  node index.js 5

# install the CLI
@install:
  npm install -g
