#include "./include/readTempHumi.h"

const char* TEMP_HUMI_TAG = "TEMP_HUMI";
float temperature = 0.0;
float humidity = 0.0;

DHT20 dht20;

void taskTemperatureHumidity(void *pvParameters)
{
    Wire.begin(TEMP_HUMI_SDA, TEMP_HUMI_SCL);
    dht20.begin();

    while(1)
    {
        dht20.read();
        temperature = dht20.getTemperature();
        humidity = dht20.getHumidity();
        ESP_LOGI(TEMP_HUMI_TAG, "Temperature: %.2f °C", temperature);
        ESP_LOGI(TEMP_HUMI_TAG, "Humidity: %.2f %%", humidity);
        
        vTaskDelay(pdMS_TO_TICKS(60000));
    }
}