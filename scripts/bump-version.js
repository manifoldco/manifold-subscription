const fs = require('fs');
const path = require('path');

const PACKAGE_JSON_LOCATION = path.resolve(__dirname, '..', 'package.json');

// read file
const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_LOCATION, 'utf8'));

// bump version
packageJson.version = process.argv[2];

// save file
fs.writeFileSync(PACKAGE_JSON_LOCATION, JSON.stringify(packageJson, undefined, 2), 'utf8');
