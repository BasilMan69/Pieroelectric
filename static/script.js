document.addEventListener("DOMContentLoaded", function () {
  const colorSelect = document.getElementById("colorSelect");
  const changeColorButton = document.getElementById("changeColorButton");
  const ledSelect = document.getElementById("ledSelect");
  const ports = [port1, port2, port3, port4];
  const select = document.getElementById("routeSelect");
  const start = document.getElementById("Start");
  const stop = document.getElementById("Stop");
  let startPlace;
  let endPlace;

  const socket = new WebSocket("ws://localhost:81/ws");

  socket.addEventListener("open", () => {
    console.log("WebSocket connection opened");
  });

  socket.addEventListener("message", (event) => {
    console.log("Message received from server:", event.data);
  });

  let ports_to_change = {};

  function choosePlace(id) {
    const portElement = document.getElementById(id);
    if (startPlace && !endPlace) {
      portElement.style.backgroundColor = "red";
      ports_to_change.startPort = [parseInt(id.charAt(4)), 1];
      select.innerHTML = "Press Start!";
      endPlace = id[id.length - 1];
    } else if (!startPlace) {
      portElement.style.backgroundColor = "green";
      ports_to_change.endPort = [parseInt(id.charAt(4)), 3];
      select.innerHTML = "Choose End Place!";
      startPlace = id[id.length - 1];
    }
  }

  function stopRoute() {
    ports.forEach((port) => (port.style.backgroundColor = "grey"));
    for (let i = 1; i <= 4; i++) {
      sendColorChange(i, 0);
    }
    select.innerHTML = "Press Start!";
    startPlace = null;
    endPlace = null;
  }

  function findRoute(startPlace, endPlace) {
    const distance = Math.abs(endPlace - startPlace);
    if ((distance > 2 || distance === 1) && startPlace != 2 && endPlace != 2) {
      port2.style.backgroundColor = "yellow";
      ports_to_change.middlePort = [2, 2];
    } else if (distance === 2) {
      port2.style.backgroundColor = "green";
      ports_to_change.middlePort = [2, 3];
    }
    select.innerHTML = "Route selected";
  }

  function changeAllPorts() {
    const ports = Object.values(ports_to_change);
    ports.forEach((port) => sendColorChange(port[0], port[1]));
    ports_to_change = {};
  }

  ports.forEach((port) => {
    port.addEventListener("click", () => {
      choosePlace(port.id);
    });
  });

  start.addEventListener("click", () => {
    findRoute(startPlace, endPlace);
    changeAllPorts();
  });

  stop.addEventListener("click", () => {
    stopRoute();
  });

  function sendColorChange(ledId, color) {
    const data = {
      ledId: ledId,
      color: color,
    };
    socket.send(JSON.stringify(data));
  }

  changeColorButton.addEventListener("click", () => {
    const selectedLed = ledSelect.value;
    const selectedColor = colorSelect.value;
    const colorMap = {
      "1": "red",
      "2": "yellow",
      "3": "green",
      "4": "white",
      default: "gray",
    };

    const color = colorMap[selectedColor] || colorMap.default;

    ports[selectedLed - 1].style.backgroundColor = color;
    sendColorChange(selectedLed, selectedColor);
  });
});
