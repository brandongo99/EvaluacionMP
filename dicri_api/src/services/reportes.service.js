const { getConnection } = require("../config/db");
const sql = require("mssql");

module.exports = {
    obtenerReporte: async (filtros) => {
        const {
            tipoReporte,
            fechaInicio = null,
            fechaFin = null,
            idTecnico = null,
            idCoordinador = null,
            idExpediente = null,
            estado = null
        } = filtros;

        const pool = await getConnection();
        const result = await pool
            .request()
            .input("TipoReporte", sql.Int, tipoReporte)
            .input("FechaInicio", sql.Date, fechaInicio)
            .input("FechaFin", sql.Date, fechaFin)
            .input("IdTecnico", sql.Int, idTecnico)
            .input("IdCoordinador", sql.Int, idCoordinador)
            .input("IdExpediente", sql.Int, idExpediente)
            .input("Estado", sql.VarChar, estado)
            .execute("sp_Reportes");

        return result.recordset;
    }
}
