
document.addEventListener("DOMContentLoaded", function () {
  const colorSelect = document.getElementById("colorSelect");
  const changeColorButton = document.getElementById("changeColorButton");
  const ledSelect = document.getElementById("ledSelect");
  const select = document.getElementById("routeSelect");
  const port1 = document.getElementById("port1");
  const port2 = document.getElementById("port2");
  const port3 = document.getElementById("port3");
  const port4 = document.getElementById("port4");
  const start = document.getElementById("Start");
  const stop = document.getElementById("Stop");
  let startPlace;
  let endPlace;

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

  
  function choosePlace(id) {
    if (startPlace && !endPlace) {
      document.getElementById(id).style.backgroundColor = "red";
      select.innerHTML = "Press Start!";
      endPlace = id[id.length - 1];
      console.log(endPlace);
    } else if (!startPlace) {
      document.getElementById(id).style.backgroundColor = "green";
      select.innerHTML = "Choose End Place!";
      startPlace = id[id.length - 1];
      console.log(startPlace);
    }
  }

  function stopRoute() {
    port1.style.backgroundColor = "grey";
    port2.style.backgroundColor = "grey";
    port3.style.backgroundColor = "grey";
    port4.style.backgroundColor = "grey";
    select.innerHTML = "Press Start!";
    startPlace = null;
    endPlace = null;
  }

  function findRoute(startPlace, endPlace) {
    console.log(Math.abs(endPlace - startPlace));
    if (
      (Math.abs(endPlace - startPlace) > 2 ||
        Math.abs(endPlace - startPlace) == 1) &&
      startPlace != 2 &&
      endPlace != 2
    ) {
      port2.style.backgroundColor = "yellow";
    } else if (Math.abs(endPlace - startPlace) == 2) {
      port2.style.backgroundColor = "green";
    }
    select.innerHTML = "Route selected";
  }

  port1.addEventListener("click", () => {
    choosePlace("port1");
  });
  port2.addEventListener("click", () => {
    choosePlace("port2");
  });
  port3.addEventListener("click", () => {
    choosePlace("port3");
  });
  port4.addEventListener("click", () => {
    choosePlace("port4");
  });
  start.addEventListener("click", () => {
    findRoute(startPlace, endPlace);
  });
  stop.addEventListener("click", () => {
    stopRoute();
  });

// Event listeners for color change buttons
  changeColorButton.addEventListener("click", () => {
    const selectedLed = ledSelect.value;
    const selectedColor = colorSelect.value;
    console.log("lol");
    sendColorChange(selectedLed, selectedColor); 
  });

});

