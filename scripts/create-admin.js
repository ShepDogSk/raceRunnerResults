const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'admin';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated hash for password "admin":');
    console.log(hash);
    console.log('\nSQL command to insert admin user:');
    console.log(`INSERT INTO user (username, password, role) VALUES ('admin', '${hash}', 'admin');`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();

