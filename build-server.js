const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Building server...');

try {
  // Clean dist directory if it exists
  if (fs.existsSync('dist')) {
    console.log('Cleaning dist directory...');
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  // Create a temporary tsconfig for server build
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  tsconfig.exclude = ['node_modules', 'dist', 'client', 'test'];
  fs.writeFileSync('tsconfig.server.json', JSON.stringify(tsconfig, null, 2));
  
  // Build server
  execSync('npx nest build -p tsconfig.server.json', {
    stdio: 'inherit'
  });
  
  // Clean up temporary tsconfig
  fs.unlinkSync('tsconfig.server.json');
  
  console.log('Server build completed successfully!');
} catch (error) {
  console.error('Error building server:', error);
  process.exit(1);
}

