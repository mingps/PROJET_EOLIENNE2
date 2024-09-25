const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const bodyParser = require("body-parser");
const tasksRoutes = require("./routes/tasksRoutes");
const WebSocket = require('ws');
const http = require('http');
const socketIo = require('socket.io');

// Importer les modules db et mqtt
const db = require('./db');
const mqttClient = require('./mqtt');

// Créer un serveur HTTP pour Express et Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Utiliser les routes de tasksRoutes
app.use("/api/tasks", tasksRoutes);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

// Configurer le serveur WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('Client WebSocket connecté');
  ws.on('message', function incoming(message) {
    console.log('Message WebSocket reçu : %s', message);
    ws.send('Message reçu');
  });
});

console.log('Serveur WebSocket en écoute');

// Utiliser le client MQTT pour envoyer les messages aux clients WebSocket
mqttClient.on('message', function (topic, message) {
  console.log('Message MQTT reçu sur %s : %s', topic, message.toString());
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
});

// Configurer Socket.IO pour envoyer les messages MQTT aux clients
io.on('connection', (socket) => {
  console.log('Client Socket.IO connecté');
  mqttClient.on('message', (topic, message) => {
    socket.emit('message', message.toString());
  });
});

// Démarrer le serveur
server.listen(port, () => console.log(`Listening on port ${port}`));