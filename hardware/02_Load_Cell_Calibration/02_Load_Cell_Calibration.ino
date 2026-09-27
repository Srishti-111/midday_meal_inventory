#include "HX711.h"

#define DT 4
#define SCK 5

HX711 scale;

void setup() {
  Serial.begin(115200);

  scale.begin(DT, SCK);

  Serial.println("HX711 Calibration");
  Serial.println("Remove all weight from the load cell.");
  delay(3000);

  scale.tare();

  Serial.println("Tare complete.");
  Serial.println("Now place a known weight on the load cell.");
}

void loop() {
  if (scale.is_ready()) {
    Serial.print("Raw value: ");
    Serial.println(scale.get_value(10));
  } else {
    Serial.println("HX711 not ready");
  }

  delay(1000);
}