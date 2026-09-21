#include "HX711.h"

#define DT 4
#define SCK 5

HX711 scale;

void setup() {
  Serial.begin(115200);

  scale.begin(DT, SCK);

  Serial.println("HX711 Test Started");

  if (scale.is_ready()) {
    Serial.println("HX711 is ready!");
  } else {
    Serial.println("HX711 not found!");
  }
}

void loop() {
  if (scale.is_ready()) {
    long reading = scale.read();

    Serial.print("Raw Reading: ");
    Serial.println(reading);
  } else {
    Serial.println("HX711 not ready!");
  }

  delay(1000);
}