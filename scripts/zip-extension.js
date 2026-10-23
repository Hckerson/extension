import { execSync } from 'child_process';
import { createReadStream, createWriteStream } from 'fs';
import { createGzip } from 'zlib';
import { join } from 'path';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
const outputName = `${packageJson.name}-${packageJson.version}.zip`;
const outputPath = join(process.cwd(), outputName);

console.log(`Creating ${outputName}...`);

if (process.platform === 'win32') {
  execSync(`powershell Compress-Archive -Path dist\\* -DestinationPath ${outputName}`);
} else {
  execSync(`zip -r ${outputName} dist/`);
}

console.log(`Extension zipped to ${outputName}`);
