const express = require("express");
const expressWs = require("express-ws");


const app = express();
expressWs(app);

// Serve static files from the "public" directory
app.use(express.static("static"));

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


// let map = new Tile[3][5];

// class Tile {
//   constructor(
//     x_pos,
//     y_pos,
//     has_LED = false,
//     has_depot = false
//   ) {
//     this.x_pos = x_pos;
//     this.y_pos = y_pos;
//     this.has_LED = has_LED;
//     this.has_depot = has_depot;
//   }

//   set LedId(ledId) {
//     if (this.has_LED) {
//       this.ledId = ledId;
//     }
//   }

//   change_color(color) {
//     if (this.has_LED) {
//       const data = {
//         type: change_color,
//         ledId: this.ledId,
//         color: color,
//       };
//       socket.send(JSON.stringify(data));
//     }
//   }
// }

// const tile1 = new Tile(0, 0, true, true, true);
// const tile2 = new Tile(0, 1, true, false, false);
// const tile3 = new Tile(0, 2, true, true, true);
// const tile4 = new Tile(1, 2, true, false, false);
// const tile5 = new Tile(2, 2, true, true, true);
// const tile6 = new Tile(0, 3, true, false, false);
// const tile7 = new Tile(0, 4, true, true, true);
// add_tile_to_map(map, tile1);
// add_tile_to_map(map, tile2);
// add_tile_to_map(map, tile3);
// add_tile_to_map(map, tile4);
// add_tile_to_map(map, tile5);
// add_tile_to_map(map, tile6);
// add_tile_to_map(map, tile7);

// const add_tile_to_map = (map, tile) => {
//     map[tile.x_pos][tile.y_pos] = tile;
// }
