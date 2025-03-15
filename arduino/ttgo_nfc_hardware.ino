/*
 * Race Runner NFC Hardware Integration
 * for TTGO T-Call V1.3 LilyGO WiFi/Bluetooth/GSM module
 * with NFC Reader, RGB LED, and Buzzer
 * 
 * This sketch connects to the Race Runner backend API and:
 * 1. Reads NFC tags
 * 2. Sends the tag ID to the backend
 * 3. Processes the response (new tag registration or lap logging)
 * 4. Provides feedback via RGB LED and Buzzer
 */

// Libraries for TTGO T-Call
#include <TinyGSM.h>
#include <Wire.h>
#include <SPI.h>

// Libraries for WiFi
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Libraries for NFC
#include <PN532_I2C.h>
#include <PN532.h>
#include <NfcAdapter.h>

// Pin definitions
#define RGB_RED    25     // Red LED pin
#define RGB_GREEN  26     // Green LED pin
#define RGB_BLUE   27     // Blue LED pin
#define BUZZER_PIN 12     // Buzzer pin

// Network configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server configuration
const char* serverUrl = "http://your-race-runner-server.com/api"; // Replace with your server URL
const char* apiKey = "your-api-key"; // Optional: for additional security

// GSM configuration (uncomment if using GSM instead of WiFi)
/*
const char apn[] = "your-apn";
const char gprsUser[] = "";
const char gprsPass[] = "";
const char simPIN[] = "";
*/

// NFC configuration
PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);

// Variables for tracking
unsigned long lastNfcReadTime = 0;
unsigned long lastLapLogTime = 0;
const unsigned long minLapTimeMs = 60000; // Minimum 1 minute between lap logs for the same tag
String lastTagId = "";

// Status indicators
enum DeviceStatus {
  IDLE,
  CONNECTING,
  READY,
  READING,
  SUCCESS_NEW_TAG,
  SUCCESS_LAP_LOGGED,
  ERROR,
  COOLDOWN
};

DeviceStatus currentStatus = IDLE;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  delay(100);
  
  Serial.println("Race Runner NFC Hardware");
  Serial.println("Initializing...");
  
  // Initialize pins
  pinMode(RGB_RED, OUTPUT);
  pinMode(RGB_GREEN, OUTPUT);
  pinMode(RGB_BLUE, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  // Set initial LED color (blue = initializing)
  setRgbColor(0, 0, 255);
  
  // Initialize NFC
  Serial.println("Initializing NFC reader...");
  nfc.begin();
  
  // Connect to WiFi
  connectToWiFi();
  
  // Initialize GSM (uncomment if using GSM)
  // connectToGSM();
  
  // Test server connection
  if (testServerConnection()) {
    Serial.println("Server connection successful!");
    setRgbColor(0, 255, 0); // Green = ready
    playTone(1000, 200);    // Success tone
    currentStatus = READY;
  } else {
    Serial.println("Server connection failed!");
    setRgbColor(255, 0, 0); // Red = error
    playTone(300, 500);     // Error tone
    currentStatus = ERROR;
  }
}

void loop() {
  // Check connection status and reconnect if necessary
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost. Reconnecting...");
    connectToWiFi();
  }
  
  // Update status
  updateStatus();
  
  // Read NFC tag if in READY state
  if (currentStatus == READY) {
    checkForNfcTag();
  }
  
  // Handle cooldown period
  if (currentStatus == COOLDOWN) {
    if (millis() - lastLapLogTime > minLapTimeMs) {
      currentStatus = READY;
      setRgbColor(0, 255, 0); // Back to green = ready
    }
  }
  
  delay(100); // Small delay to avoid excessive CPU usage
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi...");
  currentStatus = CONNECTING;
  setRgbColor(255, 165, 0); // Orange = connecting
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
    // Blink orange while connecting
    setRgbColor(255, 165, 0);
    delay(250);
    setRgbColor(0, 0, 0);
    delay(250);
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    setRgbColor(0, 255, 0); // Green = connected
    playTone(800, 200);
  } else {
    Serial.println("\nWiFi connection failed");
    setRgbColor(255, 0, 0); // Red = error
    playTone(300, 500);
    currentStatus = ERROR;
  }
}

/*
// Uncomment if using GSM instead of WiFi
void connectToGSM() {
  Serial.print("Connecting to GSM...");
  currentStatus = CONNECTING;
  setRgbColor(255, 165, 0); // Orange = connecting
  
  // Initialize GSM modem here
  
  Serial.println("GSM connected");
  setRgbColor(0, 255, 0);
}
*/

bool testServerConnection() {
  HTTPClient http;
  
  // Set URL for server health check
  http.begin(String(serverUrl) + "/health");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", apiKey);
  
  // Send HTTP GET request
  int httpResponseCode = http.GET();
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println("Response: " + payload);
    
    http.end();
    return httpResponseCode == 200;
  } else {
    Serial.print("Error on HTTP request: ");
    Serial.println(httpResponseCode);
    http.end();
    return false;
  }
}

void checkForNfcTag() {
  currentStatus = READING;
  
  // Set LED to cyan when reading
  setRgbColor(0, 255, 255);
  
  if (nfc.tagPresent()) {
    NfcTag tag = nfc.read();
    String tagId = tag.getUidString();
    
    // Process the tag
    Serial.println("NFC Tag detected: " + tagId);
    
    // Prevent multiple rapid reads of the same tag
    if (tagId != lastTagId || (millis() - lastNfcReadTime > 5000)) {
      lastTagId = tagId;
      lastNfcReadTime = millis();
      
      // Check if the same tag was logged recently (within the cooldown period)
      if (tagId == lastTagId && (millis() - lastLapLogTime < minLapTimeMs)) {
        Serial.println("Tag in cooldown period. Please wait.");
        currentStatus = COOLDOWN;
        // Purple for cooldown
        setRgbColor(128, 0, 128);
        playTone(500, 200);
        return;
      }
      
      // Send tag to server
      sendTagToServer(tagId);
    }
  } else {
    // If no tag present, go back to ready state
    if (currentStatus == READING) {
      currentStatus = READY;
      setRgbColor(0, 255, 0); // Green = ready
    }
  }
}

void sendTagToServer(String tagId) {
  HTTPClient http;
  
  // Set URL for NFC tag processing
  http.begin(String(serverUrl) + "/nfc/process-tag");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-API-Key", apiKey);
  
  // Prepare JSON data
  StaticJsonDocument<200> doc;
  doc["tagId"] = tagId;
  
  String requestBody;
  serializeJson(doc, requestBody);
  
  // Send HTTP POST request
  int httpResponseCode = http.POST(requestBody);
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println("Response: " + payload);
    
    // Parse response
    StaticJsonDocument<512> response;
    DeserializationError error = deserializeJson(response, payload);
    
    if (!error) {
      String status = response["status"];
      
      if (status == "new_tag_registered") {
        // New tag registered
        Serial.println("New tag registered successfully!");
        currentStatus = SUCCESS_NEW_TAG;
        
        // Blue for new tag
        setRgbColor(0, 0, 255);
        playSuccessMelody();
      } 
      else if (status == "lap_logged") {
        // Lap logged
        Serial.println("Lap logged successfully!");
        lastLapLogTime = millis();
        currentStatus = SUCCESS_LAP_LOGGED;
        
        // Green for lap logged
        setRgbColor(0, 255, 0);
        playSuccessTone();
        
        // Get runner details from response
        String runnerName = response["runnerName"];
        int lapNumber = response["lapNumber"];
        
        Serial.print("Runner: ");
        Serial.print(runnerName);
        Serial.print(", Lap: ");
        Serial.println(lapNumber);
        
        // Enter cooldown period
        delay(2000); // Display success for 2 seconds
        currentStatus = COOLDOWN;
        setRgbColor(128, 0, 128); // Purple for cooldown
      } 
      else if (status == "error") {
        // Error occurred
        String errorMessage = response["message"];
        Serial.print("Error: ");
        Serial.println(errorMessage);
        
        currentStatus = ERROR;
        setRgbColor(255, 0, 0); // Red for error
        playErrorTone();
        
        delay(2000); // Display error for 2 seconds
        currentStatus = READY;
        setRgbColor(0, 255, 0); // Back to green = ready
      }
    } else {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      currentStatus = ERROR;
      setRgbColor(255, 0, 0);
      playErrorTone();
    }
  } else {
    Serial.print("Error on HTTP request: ");
    Serial.println(httpResponseCode);
    currentStatus = ERROR;
    setRgbColor(255, 0, 0);
    playErrorTone();
    
    delay(2000); // Display error for 2 seconds
    currentStatus = READY;
    setRgbColor(0, 255, 0); // Back to green = ready
  }
  
  http.end();
}

void updateStatus() {
  switch (currentStatus) {
    case IDLE:
      // Slow breathing blue
      breatheLed(0, 0, 255, 2000);
      break;
    case CONNECTING:
      // Already handled in connect functions
      break;
    case READY:
      // Solid green
      setRgbColor(0, 255, 0);
      break;
    case READING:
      // Already handled in checkForNfcTag
      break;
    case SUCCESS_NEW_TAG:
    case SUCCESS_LAP_LOGGED:
    case ERROR:
    case COOLDOWN:
      // These states are temporary and handled elsewhere
      break;
    default:
      // Unknown state, set to idle
      currentStatus = IDLE;
      break;
  }
}

// RGB LED control functions
void setRgbColor(int red, int green, int blue) {
  analogWrite(RGB_RED, red);
  analogWrite(RGB_GREEN, green);
  analogWrite(RGB_BLUE, blue);
}

void breatheLed(int red, int green, int blue, int duration) {
  // Breathing effect for LED
  float breath = (exp(sin(millis()/2000.0*PI)) - 0.36787944)*108.0;
  analogWrite(RGB_RED, map(breath, 0, 255, 0, red));
  analogWrite(RGB_GREEN, map(breath, 0, 255, 0, green));
  analogWrite(RGB_BLUE, map(breath, 0, 255, 0, blue));
}

// Sound feedback functions
void playTone(int frequency, int duration) {
  tone(BUZZER_PIN, frequency, duration);
}

void playSuccessTone() {
  tone(BUZZER_PIN, 1000, 100);
  delay(100);
  tone(BUZZER_PIN, 1500, 100);
}

void playSuccessMelody() {
  int melody[] = {1000, 1200, 1500, 2000};
  int durations[] = {100, 100, 100, 200};
  
  for (int i = 0; i < 4; i++) {
    tone(BUZZER_PIN, melody[i], durations[i]);
    delay(durations[i] + 50);
  }
}

void playErrorTone() {
  tone(BUZZER_PIN, 300, 200);
  delay(250);
  tone(BUZZER_PIN, 300, 200);
}

