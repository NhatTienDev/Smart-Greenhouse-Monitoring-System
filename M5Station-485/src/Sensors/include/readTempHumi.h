#ifndef _READ_TEMP_HUMI_H_
#define _READ_TEMP_HUMI_H_

#include <Arduino.h>
#include "DHT20.h"
#include "esp_log.h"

#define TEMP_HUMI_SCL           33
#define TEMP_HUMI_SDA           32

extern const char* TEMP_HUMI_TAG;
extern float temperature;
extern float humidity;

extern DHT20 dht20;

void taskTemperatureHumidity(void *pvParameters);

#endif