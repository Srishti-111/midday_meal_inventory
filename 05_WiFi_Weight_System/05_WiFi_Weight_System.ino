#include "HX711.h"
#include <WiFi.h>

// ========================================
// HX711 CONFIGURATION
// ========================================

#define DT 4
#define SCK 5

HX711 scale;

// IMPORTANT:
// Yahan apna ACTUAL calibration factor daalo.
float CALIBRATION_FACTOR = -2280.0;


// ========================================
// WIFI CONFIGURATION
// ========================================

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";


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
    Serial.println("Check HX711 wiring.");
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
  // Read Weight
  // --------------------------------------

  if (scale.is_ready()) {

    float weightKg = scale.get_units(10);

    // Very small negative values ko zero karo
    if (weightKg < 0) {
      weightKg = 0;
    }

    Serial.print("Weight: ");
    Serial.print(weightKg, 2);
    Serial.println(" kg");

  } else {

    Serial.println("ERROR: HX711 not detected!");

  }


  // --------------------------------------
  // Check Wi-Fi
  // --------------------------------------

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println("Wi-Fi: Connected");

  } else {

    Serial.println("Wi-Fi: Disconnected");

  }

  Serial.println("----------------------------------------");

  delay(2000);
}