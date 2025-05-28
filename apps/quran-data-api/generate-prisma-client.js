const { execSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../..'); // Assuming this script is in apps/quran-data-api/
const prismaSchemaPath = path.resolve(__dirname, 'prisma/schema.prisma');
const outputDir = path.resolve(__dirname, 'api/generated/client');

console.log(`Generating Prisma client for schema: ${prismaSchemaPath}`);
console.log(`Output directory: ${outputDir}`);

try {
  // Ensure the output directory exists
  execSync(`mkdir -p ${outputDir}`);

  // Generate Prisma client
  execSync(`npx prisma generate --schema=${prismaSchemaPath} --output=${outputDir}`, { stdio: 'inherit' });
  console.log('Prisma client generated successfully.');
} catch (error) {
  console.error('Error generating Prisma client:', error.message);
  process.exit(1);
}