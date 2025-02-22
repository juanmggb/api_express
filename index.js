const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 3001;

// Permitir solicitudes desde el frontend
app.use(cors());

// Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/testdb");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conectado a MongoDB");
});

// Definir esquema y modelo
const messageSchema = new mongoose.Schema({
  text: String,
});

const Message = mongoose.model("Message", messageSchema);

// Ruta de prueba
app.get("/api/message", async (req, res) => {
  try {
    // Within the try block, the code attempts to retrieve a single message from the database using await Message.findOne(). The Message object is presumably a model defined using a library like Mongoose, which is commonly used for interacting with MongoDB in Node.js applications. The findOne method fetches the first document that matches the query criteria, or null if no documents are found
    const message = await Message.findOne();

    // If a message is successfully retrieved, the response is sent back to the client in JSON format with the key message containing the text of the message. If no message is found, the response contains the string "No hay mensajes en la base de datos"
    res.json({
      message: message ? message.text : "No hay mensajes en la base de datos",
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el mensaje" });
  }
});

// It sets up the server to listen on a specified port and includes logic to create a test message in a MongoDB database if one does not already exist.
app.listen(PORT, () => {
  // When the server starts, it logs a message to the console indicating that the API is running and provides the URL where it can be accessed.
  console.log(`API corriendo en http://localhost:${PORT}`);

  // Block of code that interacts with a MongoDB database using Mongoose, an Object Data Modeling (ODM) library for MongoDB and Node.js. The Message.findOne() method is used to search for an existing message in the Message collection. This method returns a promise, and the .then() method is used to handle the result of the promise. If no message is found (if (!message)), a new Message object is created with the text "Hola desde el backend con MongoDB!" and saved to the database using the newMessage.save() method. If an error occurs during this process, it is caught by the .catch() method, which logs an error message to the console.

  // This code ensures that when the server starts, there is at least one message in the database, which can be useful for testing or initial setup purposes.

  // Crear un mensaje de prueba si no existe
  Message.findOne()
    .then((message) => {
      if (!message) {
        const newMessage = new Message({
          text: "Hola desde el backend con MongoDB!",
        });
        newMessage.save();
      }
    })
    .catch((err) => console.error("Error al crear el mensaje de prueba:", err));
});
