const fs = require('fs');
const path = require('path');

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    try {
      fs.rmSync(folderPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
      console.log(`✓ Deleted: ${folderPath}`);
    } catch (err) {
      console.log(`✗ Could not delete: ${folderPath}`);
      console.log(`  Error: ${err.message}`);
    }
  } else {
    console.log(`- Not found: ${folderPath}`);
  }
}

console.log('Cleaning Next.js cache...\n');

deleteFolderRecursive(path.join(__dirname, '.next'));
deleteFolderRecursive(path.join(__dirname, 'node_modules', '.cache'));

console.log('\nCache cleaned! Now run: npm run dev');
