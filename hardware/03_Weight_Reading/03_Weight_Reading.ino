#include "HX711.h"

// HX711 pins
#define DT 4
#define SCK 5

HX711 scale;

// Apna calibration factor yahan daalo
float CALIBRATION_FACTOR = -2280.0;

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("================================");
  Serial.println("Smart Mid-Day Meal Weighing System");
  Serial.println("================================");

  // HX711 start
  scale.begin(DT, SCK);

  // Calibration factor set
  scale.set_scale(CALIBRATION_FACTOR);

  // Empty load cell ko zero karna
  Serial.println("Taring... Please keep load cell EMPTY");
  delay(3000);

  scale.tare();

  Serial.println("Tare complete!");
  Serial.println("Weight measurement started...");
  Serial.println("--------------------------------");
}

void loop() {

  if (scale.is_ready()) {

    // Average of 10 readings
    float weightKg = scale.get_units(10);

    // Negative value ko zero ke aas-paas handle karna
    if (weightKg < 0) {
      weightKg = 0;
    }

    Serial.print("Weight: ");
    Serial.print(weightKg, 2);
    Serial.println(" kg");

  } else {

    Serial.println("ERROR: HX711 not detected!");

  }

  delay(1000);
}