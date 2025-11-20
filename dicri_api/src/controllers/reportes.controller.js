const reportesService = require("../services/reportes.service");
const response = require("../utils/response");

module.exports = {
  obtenerReporte: async (req, res) => {
    try {
      // Recibe parámetros
      const {
        tipoReporte,
        fechaInicio,
        fechaFin,
        idTecnico,
        idCoordinador,
        idExpediente,
        estado
      } = req.query;

      if (!tipoReporte) {
        return response.error(res, "El parámetro tipoReporte es obligatorio", 400);
      }

      const data = await reportesService.obtenerReporte({
        tipoReporte: parseInt(tipoReporte),
        fechaInicio,
        fechaFin,
        idTecnico: idTecnico ? parseInt(idTecnico) : null,
        idCoordinador: idCoordinador ? parseInt(idCoordinador) : null,
        idExpediente: idExpediente ? parseInt(idExpediente) : null,
        estado
      });

      return response.success(res, data);
    } catch (err) {
      console.error("ERROR OBTENER REPORTE:", err);
      return response.error(res, "Error interno al generar el reporte", 500);
    }
  }
};