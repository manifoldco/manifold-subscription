const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * This recreates `npm version from-git` but without making a commit
 */

let version;
try {
  version = execSync('git describe --abbrev=0 --tags')
    .toString()
    .replace('v', '')
    .replace('\n', '');
} catch (e) {
  console.error(`Failed to update version: ${e.message}`);
}

if (version) {
  const pkgJSON = path.resolve(__dirname, '..', 'package.json');
  const pkgManifest = JSON.parse(fs.readFileSync(pkgJSON, 'utf8'));
  pkgManifest.version = version;
  fs.writeFileSync(pkgJSON, JSON.stringify(pkgManifest, null, 2).concat('\n'), 'utf8');
}
