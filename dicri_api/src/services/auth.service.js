const { getConnection } = require("../config/db");
const sql = require("mssql");

// Servicio de autenticación: login de usuario
async function login(correo) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("PCorreo", sql.VarChar, correo)
    .execute("sp_Login");

  return result.recordset[0];
}

module.exports = { login };