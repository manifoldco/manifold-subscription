/**
 * Changes ## [Unreleased] to the current version from Git
 */

const fs = require('fs');
const path = require('path');

const CHANGELOG = path.resolve(__dirname, '..', 'CHANGELOG.md');

// read file
const tag = process.argv[2].replace(/^v/, '');
const changelog = fs
  .readFileSync(CHANGELOG, 'utf8')
  .replace(
    /(## \[Unreleased\])/i,
    `$1\n\n## [${tag}] - ${new Date().toISOString().replace(/T.*/, '')}`
  );

fs.writeFileSync(CHANGELOG, changelog, 'utf8');
