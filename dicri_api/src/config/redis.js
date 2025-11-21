const { createClient } = require("redis");

// Crear y configurar el cliente de Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});


// Manejar errores de conexión
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect();

module.exports = redisClient;