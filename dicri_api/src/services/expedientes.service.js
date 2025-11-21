const { getConnection } = require("../config/db");
const sql = require("mssql");

module.exports = {
  // Crear expediente
  crearExpediente: async (numeroExpediente, idTecnico) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("PNumero_expediente", sql.VarChar, numeroExpediente)
      .input("PId_tecnico", sql.Int, idTecnico)
      .execute("sp_InsertExpediente");

    return result.recordset[0]; // devuelve { id_expediente }
  },

  // Listar expedientes con filtros
  listar: async (estado, inicio, fin, id_tecnico) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("PEstado", sql.VarChar, estado)
      .input("PFecha_inicio", sql.Date, inicio)
      .input("PFecha_fin", sql.Date, fin)
      .input("PId_tecnico", sql.Int, id_tecnico)
      .execute("sp_GetExpedientes");

    return result.recordset;
  },

  // Cambia estado expediente
  cambiaEstado: async (id_expediente, nuevo_estado, id_usuario, justificacion = null) => {
    const pool = await getConnection();
    const estadosValidos = ["En revisión", "Aprobado", "Rechazado"];
    
    if (!estadosValidos.includes(nuevo_estado)) {
      throw new Error(`Estado inválido: ${nuevo_estado}`);
    }

    const request = pool.request()
      .input("PId_expediente", sql.Int, id_expediente)
      .input("PNuevoEstado", sql.VarChar, nuevo_estado)
      .input("PId_usuario", sql.Int, id_usuario);

    if (nuevo_estado === "Rechazado") {
      if (!justificacion) {
        throw new Error("Debe proporcionar justificación para rechazar.");
      }
      request.input("PJustificacion", sql.VarChar, justificacion);
    } else {
      request.input("PJustificacion", sql.VarChar, null);
    }

    const result = await request.execute("sp_CambiaEstadoExpediente");

    return {
      message: `Expediente ${nuevo_estado.toLowerCase()}`,
      resultado: result.recordset[0]
    };
  },

  // Obtener siguiente número de expediente
  obtenerSiguienteNumero: async () => {
    const pool = await getConnection();
    const result = await pool.request().execute("sp_GetNextNumeroExpediente");
    return result.recordset[0];
  }
};