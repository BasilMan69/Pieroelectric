const express = require("express");
const expressWs = require("express-ws");


const app = express();
expressWs(app);

// Serve static files from the "public" directory
app.use(express.static("static"));

const mapRouter = require("./dig_map");
app.use("/map", mapRouter);

const clientConnections = [];

// WebSocket route for communication with ESP8266
app.ws("/ws", (ws, req) => {
  console.log("WebSocket connection established");
  clientConnections.push(ws);
  ws.on("message", (msg) => {
    console.log("Message from client:", msg);
    const data = JSON.parse(msg);
    // Check the LED ID and color in the data and send event to all clients
    if (data.hasOwnProperty("ledId") && data.hasOwnProperty("color")) {
      sendEventToClients(data);
    }
    // sendEventToClients({ type: "change-color", message: msg});
    // Forward the message to the ESP8266 WebSocket server
    // You'll need to implement this part using your ESP8266 WebSocket code
  });
});

function sendEventToClients(eventData) {
    for (const connection of clientConnections) {
      connection.send(JSON.stringify(eventData));
    }
  }
  
// Start the Express server
const PORT = process.env.PORT || 81;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
