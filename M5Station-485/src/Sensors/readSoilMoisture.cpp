#include "./include/readSoilMoisture.h"

const char* SOIL_MOISTURE_TAG = "SOIL_MOISTURE";
float soilMoisture = 0.0;
const int N_SAMPLES = 10;

void taskSoilMoisture(void *pvParameters)
{
    pinMode(SOIL_MOISTURE_SIG, INPUT);
    analogReadResolution(12);

    while(1)
    {
        int sum = 0;
        for(int i = 0; i < N_SAMPLES; i++)
        {
            sum += analogRead(SOIL_MOISTURE_SIG);
            vTaskDelay(5/portTICK_PERIOD_MS);
        }
        
        int raw = sum/N_SAMPLES;

        int tempSoilMoisture = map(raw, 0, 4095, 0, 100);
        soilMoisture = constrain(tempSoilMoisture, 0, 100);
        ESP_LOGI(SOIL_MOISTURE_TAG, "Soil moisture: %.2f %%", soilMoisture);

        vTaskDelay(pdMS_TO_TICKS(60000));
    }
}