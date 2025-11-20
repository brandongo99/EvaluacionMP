const { getConnection } = require("../config/db");
const sql = require("mssql");

module.exports = {
  crearIndicio: async (indicio) => {
    const {
      descripcion,
      color,
      tamano,
      peso,
      ubicacion,
      id_expediente,
      id_tecnico
    } = indicio;

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("PDescripcion", sql.VarChar, descripcion)
      .input("PColor", sql.VarChar, color)
      .input("PTamano", sql.VarChar, tamano)
      .input("PPeso", sql.Decimal(10,2), peso)
      .input("PUbicacion", sql.VarChar, ubicacion)
      .input("PId_expediente", sql.Int, id_expediente)
      .input("PId_tecnico", sql.Int, id_tecnico)
      .execute("sp_InsertIndicio");

    return result.recordset[0];
  }
};