
document.addEventListener("DOMContentLoaded", function () {
  const colorSelect = document.getElementById("colorSelect");
  const changeColorButton = document.getElementById("changeColorButton");
  const ledSelect = document.getElementById("ledSelect");

  // Create a WebSocket connection to the Express server WebSocket route
  const socket = new WebSocket("ws://localhost:81/ws");

  socket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened");
  });

  socket.addEventListener("message", (event) => {
    console.log("Message received from server:", event.data);

  });

  function sendColorChange(ledId, color) {
    const data = {
      ledId: ledId,
      color: color
    };
    socket.send(JSON.stringify(data));
  }

// Event listeners for color change buttons
  changeColorButton.addEventListener("click", () => {
    const selectedLed = ledSelect.value;
    const selectedColor = colorSelect.value;
    sendColorChange(selectedLed, selectedColor); 
  });

});

