#ifndef _READ_SOIL_MOISTURE_H_
#define _READ_SOIL_MOISTURE_H_

#include <Arduino.h>
#include "esp_log.h"

#define SOIL_MOISTURE_SIG       36

extern const char* SOIL_MOISTURE_TAG;
extern float soilMoisture;
extern const int N_SAMPLES;

void taskSoilMoisture(void *pvParameters);

#endif