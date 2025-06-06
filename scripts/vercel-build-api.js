const { execSync } = require('child_process');
const path = require('path');

const projectDir = path.resolve(__dirname, '..');
const apiDir = path.resolve(projectDir, 'apps/quran-data-api');

console.log(`Explicitly building quran-data-api in: ${apiDir}`);

execSync('npm run build', { cwd: apiDir, stdio: 'inherit' });