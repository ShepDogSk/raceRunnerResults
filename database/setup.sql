-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS michalgasparik_4;

-- Use the database
USE michalgasparik_4;

-- Create Category table
CREATE TABLE IF NOT EXISTS category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  distance FLOAT NOT NULL,
  year INT NOT NULL
);

-- Create Runner Status enum
CREATE TABLE IF NOT EXISTS runner_status (
  id VARCHAR(20) PRIMARY KEY
);

-- Insert status values
INSERT IGNORE INTO runner_status (id) VALUES 
  ('not_started'),
  ('running'),
  ('paused'),
  ('finished');

-- Create Runner table
CREATE TABLE IF NOT EXISTS runner (
  id INT AUTO_INCREMENT PRIMARY KEY,
  runnerNumber INT NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  email VARCHAR(255),
  phoneNumber VARCHAR(50),
  categoryId INT,
  internalNote TEXT,
  nfcChipId VARCHAR(255),
  status VARCHAR(20) DEFAULT 'not_started',
  isStarted BOOLEAN DEFAULT FALSE,
  startTime DATETIME,
  isPaused BOOLEAN DEFAULT FALSE,
  pauseTime DATETIME,
  totalPausedTime INT DEFAULT 0,
  isFinished BOOLEAN DEFAULT FALSE,
  finishTime DATETIME,
  totalRunningTime INT,
  totalLaps INT DEFAULT 0,
  totalDistance FLOAT DEFAULT 0,
  FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE SET NULL,
  FOREIGN KEY (status) REFERENCES runner_status(id)
);

-- Create Lap table
CREATE TABLE IF NOT EXISTS lap (
  id INT AUTO_INCREMENT PRIMARY KEY,
  runnerId INT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  distance FLOAT NOT NULL,
  lapNumber INT NOT NULL,
  FOREIGN KEY (runnerId) REFERENCES runner(id) ON DELETE CASCADE
);

-- Create NFC Tag table
CREATE TABLE IF NOT EXISTS nfc_tag (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tagId VARCHAR(255) NOT NULL UNIQUE,
  runnerId INT NULL,
  firstSeen DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastSeen DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastAssigned DATETIME NULL,
  isActive BOOLEAN DEFAULT true,
  FOREIGN KEY (runnerId) REFERENCES runner(id) ON DELETE SET NULL
);

-- Create NFC Log table
CREATE TABLE IF NOT EXISTS nfc_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  eventType ENUM('scan', 'tag_registered', 'tag_assigned', 'tag_unassigned', 'runner_started', 'lap_logged', 'scan_throttled', 'error') NOT NULL,
  tagId VARCHAR(255),
  tagFk INT NULL,
  runnerId INT NULL,
  details TEXT NULL,
  lapNumber INT NULL,
  isThrottled BOOLEAN DEFAULT false,
  errorMessage TEXT NULL,
  FOREIGN KEY (tagFk) REFERENCES nfc_tag(id) ON DELETE SET NULL,
  FOREIGN KEY (runnerId) REFERENCES runner(id) ON DELETE SET NULL
);

-- Update Runner table to add NFC tag ID
ALTER TABLE runner ADD COLUMN nfcTagId VARCHAR(255) NULL;

-- Create User table
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin'
);

-- Insert default admin user (password: admin)
INSERT INTO user (username, password, role) 
VALUES ('admin', '$2b$10$ywmIb8dLLWGYt7.Tn7VsAOTXuX.B1C8vKLVJJHKfG4.wLl.UlvKZe', 'admin');


