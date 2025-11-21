const sql = require('mssql');

// Configuración de la base de datos SQL Server
const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Función para obtener una conexión a la base de datos
async function getConnection() {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (err) {
    console.error("Error de conexión SQL:", err);
    throw err;
  }
}

module.exports = { getConnection };