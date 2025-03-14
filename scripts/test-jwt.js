const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'http://localhost:3000/api';
const username = 'admin';
const password = 'admin';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper function to log with colors
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Helper function to log errors
function logError(message, error) {
  log(`ERROR: ${message}`, colors.red);
  if (error.response) {
    log(`Status: ${error.response.status}`, colors.red);
    log(`Data: ${JSON.stringify(error.response.data, null, 2)}`, colors.red);
  } else {
    log(`Message: ${error.message}`, colors.red);
  }
}

// Step 1: Login and get token
async function login() {
  log('Step 1: Attempting to login...', colors.cyan);
  
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });
    
    const { access_token, user } = response.data;
    log('Login successful!', colors.green);
    log(`User: ${JSON.stringify(user, null, 2)}`, colors.green);
    log(`Token: ${access_token.substring(0, 20)}...`, colors.green);
    
    return access_token;
  } catch (error) {
    logError('Login failed', error);
    process.exit(1);
  }
}

// Step 2: Decode token locally
function decodeToken(token) {
  log('\nStep 2: Decoding token locally...', colors.cyan);
  
  try {
    const decoded = jwt.decode(token, { complete: true });
    log('Token decoded successfully!', colors.green);
    log(`Header: ${JSON.stringify(decoded.header, null, 2)}`, colors.green);
    log(`Payload: ${JSON.stringify(decoded.payload, null, 2)}`, colors.green);
    
    // Check expiration
    const expirationDate = new Date(decoded.payload.exp * 1000);
    const now = new Date();
    
    if (expirationDate > now) {
      log(`Token is valid until: ${expirationDate.toLocaleString()}`, colors.green);
    } else {
      log(`Token has expired on: ${expirationDate.toLocaleString()}`, colors.red);
    }
    
    return decoded;
  } catch (error) {
    logError('Failed to decode token', error);
    return null;
  }
}

// Step 3: Verify token with server
async function verifyToken(token) {
  log('\nStep 3: Verifying token with server...', colors.cyan);
  
  try {
    const response = await axios.get(`${API_URL}/auth/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    log('Token verification successful!', colors.green);
    log(`Response: ${JSON.stringify(response.data, null, 2)}`, colors.green);
    return response.data;
  } catch (error) {
    logError('Token verification failed', error);
    return null;
  }
}

// Step 4: Access protected endpoint
async function accessProtectedEndpoint(token) {
  log('\nStep 4: Accessing protected endpoint...', colors.cyan);
  
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    log('Protected endpoint access successful!', colors.green);
    log(`Response: ${JSON.stringify(response.data, null, 2)}`, colors.green);
    return response.data;
  } catch (error) {
    logError('Protected endpoint access failed', error);
    return null;
  }
}

// Step 5: Try to create a category
async function createCategory(token) {
  log('\nStep 5: Attempting to create a category...', colors.cyan);
  
  const testCategory = {
    name: 'Test Category',
    distance: 10.5,
    year: 2025,
  };
  
  try {
    const response = await axios.post(`${API_URL}/categories`, testCategory, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    log('Category creation successful!', colors.green);
    log(`Response: ${JSON.stringify(response.data, null, 2)}`, colors.green);
    return response.data;
  } catch (error) {
    logError('Category creation failed', error);
    
    // Log the request details for debugging
    log('\nRequest details:', colors.yellow);
    log(`URL: ${API_URL}/categories`, colors.yellow);
    log(`Headers: ${JSON.stringify({
      Authorization: `Bearer ${token.substring(0, 20)}...`,
      'Content-Type': 'application/json',
    }, null, 2)}`, colors.yellow);
    log(`Data: ${JSON.stringify(testCategory, null, 2)}`, colors.yellow);
    
    return null;
  }
}

// Main function
async function main() {
  log('JWT Token Test Script', colors.magenta);
  log('====================\n', colors.magenta);
  
  try {
    // Step 1: Login
    const token = await login();
    
    // Step 2: Decode token
    const decodedToken = decodeToken(token);
    
    // Step 3: Verify token
    await verifyToken(token);
    
    // Step 4: Access protected endpoint
    await accessProtectedEndpoint(token);
    
    // Step 5: Create category
    await createCategory(token);
    
    log('\nTest completed!', colors.magenta);
  } catch (error) {
    log(`\nUnexpected error: ${error.message}`, colors.red);
  }
}

// Run the main function
main();
