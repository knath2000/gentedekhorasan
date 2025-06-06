const fs = require('fs');
const path = require('path');

console.log('🔧 Vercel Pre-build: Starting package.json modification...');

if (process.env.VERCEL) {
  console.log('✅ Detected Vercel environment');
  
  const packagePath = path.join(__dirname, '../package.json');
  
  // Read current package.json
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (pkg.packageManager) {
    console.log(`📦 Found packageManager: ${pkg.packageManager}`);
    
    // Store original for potential restoration
    fs.writeFileSync(
      path.join(__dirname, '../package.json.backup'), 
      JSON.stringify(pkg, null, 2)
    );
    console.log('💾 Created backup of original package.json');
    
    // Remove packageManager field
    delete pkg.packageManager;
    
    // Write modified package.json
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
    
    console.log('✅ Removed packageManager field for Vercel build');
    console.log('🚀 Vercel can now use npm as specified in installCommand');
  } else {
    console.log('ℹ️  No packageManager field found, proceeding normally');
  }
} else {
  console.log('ℹ️  Local environment detected, skipping package.json modification');
}

console.log('🔧 Vercel Pre-build: Complete\n');