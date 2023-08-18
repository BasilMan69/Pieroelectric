#include <Adafruit_NeoPixel.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
ESP8266WiFiMulti WiFiMulti;

#include <WebSocketsClient.h>
// #include <SocketIOclient.h>
// SocketIOclient socketIO;

WebSocketsClient webSocket;

// Define your WiFi credentials
const char* ssid = "American Study";
const char* password = "66668888";

// #define PIN            D1   // Define the pin where the Neopixel data line is connected
#define NUMPIXELS      12   // Define the number of Neopixels in your LED ring

Adafruit_NeoPixel strips[3] = {
  Adafruit_NeoPixel(NUMPIXELS, D1, NEO_GRB + NEO_KHZ800),
  Adafruit_NeoPixel(NUMPIXELS, D2, NEO_GRB + NEO_KHZ800),
  Adafruit_NeoPixel(NUMPIXELS, D4, NEO_GRB + NEO_KHZ800)
};

void setupWiFi() {
  Serial.println("[SETUP] Connecting to WiFi...");
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, password);
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }
  Serial.print("[SETUP] WiFi Connected. IP: ");
  Serial.println(WiFi.localIP());
}

void setupWebSocket() {
  Serial.println("[SETUP] Initializing WebSocket...");
  webSocket.begin("192.168.0.102", 81, "/ws"); // Replace with your server IP and port
  webSocket.onEvent(webSocketEvent);
}

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println();
  Serial.println("[SETUP] BOOT");

  setupWiFi();
  setupWebSocket();

  for (int i = 0; i < 3; i++) {
    strips[i].begin();
    strips[i].show();  // Initialize all pixels to 'off'
  }

}

void loop() {
  webSocket.loop();

}

void changeNeoPixelColor(int ledId, int colorId) {
  if (colorId == 0){
    for (int i = 0; i < NUMPIXELS; i++) {
      strips[ledId - 1].setPixelColor(i, 0);
    }
    strips[ledId - 1].show();
    return;
  }

  uint32_t colorRGB;
  switch (colorId) {
    case 1:
      colorRGB = strips[ledId - 1].Color(255, 0, 0); // Red
      break;
    case 2:
      colorRGB = strips[ledId - 1].Color(255, 255, 0); // Yellow
      break;
    case 3:
      colorRGB = strips[ledId - 1].Color(0, 255, 0); // Green
      break;
    case 4:
      colorRGB = strips[ledId - 1].Color(255, 255, 255); // White
      break;
    default:
      return;
  }

  for (int i = 0; i < NUMPIXELS; i++) {
    strips[ledId - 1].setPixelColor(i, colorRGB);
  }
  strips[ledId - 1].show();
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket disconnected");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket connected");
      break;
    case WStype_TEXT:
      Serial.print("Received message: ");
      Serial.println((char*)payload);
      
      DynamicJsonDocument doc(1024); // Adjust buffer size as needed
      deserializeJson(doc, payload);

      // Check the event type and take appropriate action
      // Handle the event based on the message
      int ledId = doc["ledId"].as<int>();
      int color = doc["color"].as<int>();
      Serial.print("LED ID: ");
      Serial.print(ledId);
      Serial.print(", Color: ");
      Serial.println(color);
      changeNeoPixelColor(ledId, color);
      
      // Process the received message and change NeoPixel color if needed
      break;
  }
}