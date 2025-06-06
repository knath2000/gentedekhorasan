const fs = require('fs');
const path = require('path');

console.log('🔧 Vercel Pre-build: Starting comprehensive environment setup...');

if (process.env.VERCEL) {
  console.log('✅ Detected Vercel environment');
  
  // Environment check
  console.log('📊 Environment Status:');
  console.log(`   Node.js: ${process.version}`);
  console.log(`   FORCE_NPM: ${process.env.FORCE_NPM || 'not set'}`);
  console.log(`   COREPACK_ENABLE_AUTO_PIN: ${process.env.COREPACK_ENABLE_AUTO_PIN || 'not set'}`);

  const packagePath = path.join(__dirname, '../package.json');
  const backupPath = path.join(__dirname, '../package.json.backup');

  try {
    // Read current package.json
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    console.log('📦 Package.json Analysis:');
    console.log(`   packageManager: ${pkg.packageManager || 'not set'}`);
    console.log(`   engines.node: ${pkg.engines?.node || 'not set'}`);

    if (pkg.packageManager) {
      console.log(`🔄 Removing packageManager field: ${pkg.packageManager}`);

      // Create backup only if it doesn't exist
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, JSON.stringify(pkg, null, 2));
        console.log('💾 Created backup of original package.json');
      } else {
        console.log('💾 Backup already exists, skipping');
      }

      // Remove packageManager field to force npm usage
      delete pkg.packageManager;
      
      // Ensure engines.node is compatible
      if (pkg.engines && pkg.engines.node) {
        console.log(`🔧 Node.js engine requirement: ${pkg.engines.node}`);
      }

      // Write modified package.json
      fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));

      console.log('✅ Successfully removed packageManager field');
      console.log('🚀 Vercel will now use npm as specified in installCommand');
    } else {
      console.log('ℹ️  No packageManager field found, package.json is already npm-ready');
    }

    // Check for .npmrc presence
    const npmrcPath = path.join(__dirname, '../.npmrc');
    if (fs.existsSync(npmrcPath)) {
      const npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
      console.log('📝 .npmrc configuration found:');
      console.log(npmrcContent.split('\n').map(line => `   ${line}`).join('\n'));
    } else {
      console.log('⚠️  .npmrc file not found');
    }

    // Verify critical directories exist
    const criticalDirs = ['apps/quranexpo-web', 'apps/quran-data-api'];
    console.log('📁 Checking critical directories:');
    criticalDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      if (fs.existsSync(dirPath)) {
        console.log(`   ✅ ${dir} exists`);
      } else {
        console.log(`   ❌ ${dir} missing`);
      }
    });

  } catch (error) {
    console.error('❌ Error during pre-build setup:', error.message);
    process.exit(1);
  }

} else {
  console.log('ℹ️  Local environment detected, skipping Vercel-specific modifications');
}

console.log('🔧 Vercel Pre-build: Complete\n');
console.log('🚀 Ready for npm install and build process...\n');