#include "HX711.h"
#include <WiFi.h>
#include <HTTPClient.h>

// ========================================
// HX711 CONFIGURATION
// ========================================

#define DT 4
#define SCK 5

HX711 scale;

// IMPORTANT:
// Apna ACTUAL calibration factor yahan daalo.
float CALIBRATION_FACTOR = -2280.0;


// ========================================
// WIFI CONFIGURATION
// ========================================

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";


// ========================================
// FASTAPI CONFIGURATION
// ========================================

const char* serverUrl =
  "http://172.18.32.94:8000/api/sensors/readings";

const char* deviceId = "ESP32-001";
const char* ingredient = "rice";


// ========================================
// SETUP
// ========================================

void setup() {

  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("========================================");
  Serial.println("Smart Mid-Day Meal Inventory System");
  Serial.println("ESP32 + Load Cell + HX711 + Wi-Fi");
  Serial.println("========================================");


  // --------------------------------------
  // Start HX711
  // --------------------------------------

  scale.begin(DT, SCK);

  if (!scale.is_ready()) {
    Serial.println("ERROR: HX711 not detected!");
  }

  scale.set_scale(CALIBRATION_FACTOR);

  Serial.println();
  Serial.println("Taring load cell...");
  Serial.println("Please keep the load cell EMPTY.");

  delay(3000);

  scale.tare();

  Serial.println("Tare complete!");
  Serial.println();


  // --------------------------------------
  // Connect to Wi-Fi
  // --------------------------------------

  Serial.print("Connecting to Wi-Fi");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Wi-Fi Connected!");

  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());


  Serial.println();
  Serial.println("========================================");
  Serial.println("SYSTEM READY");
  Serial.println("========================================");
}


// ========================================
// LOOP
// ========================================

void loop() {

  // --------------------------------------
  // Check HX711
  // --------------------------------------

  if (!scale.is_ready()) {

    Serial.println("ERROR: HX711 not detected!");
    delay(2000);
    return;
  }


  // --------------------------------------
  // Read Weight in KG
  // --------------------------------------

  float weightKg = scale.get_units(10);

  // Small negative values ko zero karo
  if (weightKg < 0) {
    weightKg = 0;
  }


  Serial.println();
  Serial.println("----------------------------------------");

  Serial.print("Weight: ");
  Serial.print(weightKg, 2);
  Serial.println(" kg");


  // --------------------------------------
  // Check Wi-Fi
  // --------------------------------------

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println("Wi-Fi: Connected");


    // ------------------------------------
    // Create HTTP Client
    // ------------------------------------

    HTTPClient http;

    http.begin(serverUrl);

    http.addHeader("Content-Type", "application/json");


    // ------------------------------------
    // Create JSON
    // ------------------------------------

    String jsonData = "{";
    jsonData += "\"device_id\":\"";
    jsonData += deviceId;
    jsonData += "\",";
    jsonData += "\"ingredient\":\"";
    jsonData += ingredient;
    jsonData += "\",";
    jsonData += "\"weight\":";
    jsonData += String(weightKg, 2);
    jsonData += "}";


    Serial.println("Sending data to FastAPI:");
    Serial.println(jsonData);


    // ------------------------------------
    // Send POST Request
    // ------------------------------------

    int httpResponseCode = http.POST(jsonData);


    // ------------------------------------
    // Check Response
    // ------------------------------------

    Serial.print("HTTP Response Code: ");
    Serial.println(httpResponseCode);

    if (httpResponseCode > 0) {

      String response = http.getString();

      Serial.println("FastAPI Response:");
      Serial.println(response);

    } else {

      Serial.print("POST failed: ");
      Serial.println(http.errorToString(httpResponseCode));

    }


    http.end();

  } else {

    Serial.println("Wi-Fi: Disconnected");

  }


  Serial.println("----------------------------------------");

  // Send every 5 seconds
  delay(5000);
}