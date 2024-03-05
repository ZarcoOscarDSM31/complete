const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

// URL de conexión a la base de datos MongoDB
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'proyect';

// Middleware de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permitir acceso desde cualquier origen
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // Permitir métodos HTTP
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Permitir encabezados personalizados
  next();
});

// Ruta para obtener los datos de la colección historial
app.get('/historial', async (req, res) => {
  let client;

  try {
    // Conectar a la base de datos
    client = new MongoClient(mongoURI);
    await client.connect();
    
    // Obtener los datos de la colección historial
    const db = client.db(dbName);
    const collection = db.collection('data');
    const data = await collection.find({}).toArray();

    // Agrega logs para verificar si se obtienen datos correctamente
    console.log('Datos obtenidos de la colección:', data);
    
    // Enviar los datos como respuesta
    res.json(data);
  } catch (error) {
    console.error('Error al obtener datos de la colección historial:', error);
    res.status(500).json({ error: 'Error al obtener datos de la colección historial' });
  } finally {
    // Cerrar la conexión en el bloque finally para asegurarse de que siempre se cierre
    if (client) {
      await client.close();
    }
  }
});

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
