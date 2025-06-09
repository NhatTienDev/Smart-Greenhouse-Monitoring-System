#ifndef _MODEL_H_
#define _MODEL_H_

#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/schema/schema_generated.h"
#include "tensorflow/lite/micro/all_ops_resolver.h"
#include "tensorflow/lite/micro/micro_error_reporter.h"
#include "tensorflow/lite/c/common.h"
#include "esp_log.h"
#include <vector>
#include <cmath>
#include <random>
#include <Arduino.h>
// #include "tensorflow/lite/version.h"

#define SEQUENCE_LEN                    10
#define NUM_FEATURES                    3

#define kTensorArenaSize                20*1024

extern const unsigned char model_tflite[];
extern const unsigned int model_tflite_len;

extern const char* MODEL_TAG;

extern std::random_device rd;
extern std::mt19937 gen;

extern float temp_min, temp_max;
extern float humi_min, humi_max;
extern float soil_min, soil_max;
extern const float sensorMin[NUM_FEATURES];
extern const float sensorMax[NUM_FEATURES];

extern float sequenceBuffer[SEQUENCE_LEN][NUM_FEATURES];
extern int bufferIndex;
extern int timeCounter;
extern float nextActualVal[NUM_FEATURES];

extern uint8_t tensorArena[kTensorArenaSize];

extern tflite::MicroInterpreter* interpreter;
extern TfLiteTensor* input;
extern TfLiteTensor* output;

float getRandomVal(float min, float max, std::mt19937& gen);
void initModel();
float normalizeData(float value, int featureIndex);
float denormalizeData(float value, int featureIndex);
std::vector<float> processModel(float &temp_val, float &humi_val, float &soil_val);

#endif // _MODEL_H_