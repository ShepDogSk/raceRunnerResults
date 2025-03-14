# Race Runner Application

A comprehensive application for managing race runners, tracking laps, and displaying real-time race results with NFC hardware integration.

## Features

- **Public Interface**: View race results by category with real-time running times
- **Admin Interface**: Manage runners, categories, and track race progress
- **Authentication**: Secure JWT-based authentication
- **Runner Management**: 
  - Start, pause, resume, and finish runner races
  - Log completed laps manually or via NFC tags
  - Track total running time (excluding paused time)
- **NFC Hardware Integration**: 
  - Automated lap tracking using NFC tags
  - Arduino-based hardware with RGB status indicators
  - WiFi/GSM connectivity options
- **Real-time Updates**: Track runner progress, lap completion, and running times
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: NestJS with TypeScript
- **Frontend**: React with TypeScript
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS with responsive design

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MySQL database

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=your-db-host
DB_PORT=3306
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name

# JWT Configuration
JWT_SECRET=your-jwt-secret
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/race-runner-app.git
cd race-runner-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
mysql -h your-db-host -u your-db-username -p your-db-name < database/setup.sql
```

4. Build the application:
```bash
npm run build
```

## Running the Application

### Development Mode

```bash
# Start the backend in development mode
npm run start:dev

# Start the frontend in development mode (in a separate terminal)
npm run client:dev
```

### Production Mode

```bash
# Build and start the application in production mode
npm run build
npm run start:prod
```

The application will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## Default Admin Credentials

The application comes with a default admin user:
- Username: `admin`
- Password: `admin`

## Authentication Debugging

If you encounter authentication issues, you can use the included JWT debugging tools:

1. Run the JWT test script:
```bash
npm run test:jwt
```

This script will:
- Attempt to login with the default admin credentials
- Decode the JWT token locally
- Verify the token with the server
- Access a protected endpoint
- Try to create a test category

The script will provide detailed output about each step, helping you identify where any authentication issues might be occurring.

2. Access the JWT debug endpoints:
- `GET /api/auth/debug/health`: Check if the JWT debug controller is working
- `GET /api/auth/debug/token-info`: Get information about your JWT token (requires authentication)
- `GET /api/auth/verify-token`: Verify a JWT token

## Troubleshooting

### Authentication Issues

If you're having trouble with authentication:

1. Check the server logs for detailed authentication information
2. Verify that the JWT_SECRET in your .env file matches the one used to sign tokens
3. Make sure the token is being properly included in the Authorization header
4. Run the JWT test script to diagnose specific issues

### Database Connection Issues

If you're having trouble connecting to the database:

1. Verify your database credentials in the .env file
2. Make sure the database server is running and accessible
3. Check that the database and tables have been properly created

## License

This project is licensed under the MIT License - see the LICENSE file for details.
