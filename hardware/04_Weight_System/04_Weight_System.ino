#include "HX711.h"
#include <WiFi.h>

// ---------------- HX711 ----------------
#define DT 4
#define SCK 5

HX711 scale;

// Apna calibration factor yahan daalo
float CALIBRATION_FACTOR = -2280.0;

// ---------------- Wi-Fi ----------------
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("================================");
  Serial.println("Smart Mid-Day Meal Inventory");
  Serial.println("ESP32 + HX711 + Load Cell");
  Serial.println("================================");

  // HX711 start
  scale.begin(DT, SCK);

  scale.set_scale(CALIBRATION_FACTOR);

  Serial.println("Taring...");
  Serial.println("Keep load cell EMPTY.");

  delay(3000);

  scale.tare();

  Serial.println("Tare complete!");
  Serial.println();

  // Wi-Fi start
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

  Serial.println("--------------------------------");
  Serial.println("System Ready!");
  Serial.println("--------------------------------");
}

void loop() {

  // Check HX711
  if (scale.is_ready()) {

    float weightKg = scale.get_units(10);

    // Small negative values ko zero karo
    if (weightKg < 0) {
      weightKg = 0;
    }

    Serial.print("Weight: ");
    Serial.print(weightKg, 2);
    Serial.println(" kg");

  } else {

    Serial.println("ERROR: HX711 not detected!");

  }

  // Wi-Fi status
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Wi-Fi: Connected");
  } else {
    Serial.println("Wi-Fi: Disconnected");
  }

  Serial.println("--------------------------------");

  delay(2000);
}