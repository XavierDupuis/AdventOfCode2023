const fs = require('fs');
const path = require('path');

const mainFile = process.argv[2];
const filePath = path.resolve(__dirname, 'days', mainFile, 'solution.ts');

console.log(filePath)

if (fs.existsSync(filePath)) {
  require('ts-node').register();
  require(filePath);
} else {
  console.error(`Main file "${mainFile}" not found.`);
  process.exit(1);
}