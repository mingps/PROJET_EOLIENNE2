const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const tasksRoutes = require("./routes/tasksRoutes");
const client = require('./mqtt'); // Importer le module MQTT
const { connectDB } = require('./db'); // Importer le module DB


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use("/api/tasks", tasksRoutes);

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/client/build/index.html"));
// });

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  connectDB(); // Connect to the database when the server starts
});