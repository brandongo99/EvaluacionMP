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

  // Enviar expediente a revisión
  enviarRevision: async (id_expediente, id_usuario_envia) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("PId_expediente", sql.Int, id_expediente)
      .input("PId_usuario_envia", sql.Int, id_usuario_envia)
      .execute("sp_EnviarExpedienteRevision");

    return result.recordset[0];
  },

  // Aprobar expediente
  aprobar: async (id_expediente, id_coordinador) => {
    const pool = await getConnection();
    await pool
      .request()
      .input("PId_expediente", sql.Int, id_expediente)
      .input("PId_coordinador", sql.Int, id_coordinador)
      .execute("sp_AprobarExpediente");

    return { message: "Expediente aprobado" };
  },

  // Rechazar expediente
  rechazar: async (id_expediente, id_coordinador, justificacion) => {
    const pool = await getConnection();
    await pool
      .request()
      .input("PId_expediente", sql.Int, id_expediente)
      .input("PId_coordinador", sql.Int, id_coordinador)
      .input("PJustificacion", sql.VarChar, justificacion)
      .execute("sp_RechazarExpediente");

    return { message: "Expediente rechazado" };
  }
};