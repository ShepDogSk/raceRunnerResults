const { execSync } = require('child_process');
const path = require('path');

console.log('Building client...');

try {
  // Run webpack with explicit JSX flag
  execSync('npx tsc --jsx react && npx webpack --mode production', {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  console.log('Client build completed successfully!');
} catch (error) {
  console.error('Error building client:', error);
  process.exit(1);
}
