const expedienteService = require("../services/expedientes.service");
const response = require("../utils/response");

module.exports = {
  // Crear expediente (Técnico)
  crearExpediente: async (req, res) => {
    try {
      const { numero_expediente } = req.body;
      const id_tecnico = req.user.id_usuario;

      if (!numero_expediente) {
        return response.error(res, "El número de expediente es obligatorio", 400);
      }

      const data = await expedienteService.crearExpediente(numero_expediente, id_tecnico);
      return response.success(res, data);
    } catch (err) {
      console.error("ERROR CREAR EXPEDIENTE:", err);
      return response.error(res, "Error interno al crear expediente", 500);
    }
  },

  // Enviar expediente a revisión
  enviarRevision: async (req, res) => {
    try {
      const { id } = req.params;
      const id_usuario_envia = req.user.id_usuario; // el técnico del token

      const data = await expedienteService.enviarRevision(
        parseInt(id),
        id_usuario_envia
      );

      return response.success(res, data);
    } catch (err) {
      console.error("ERROR ENVIAR REVISION:", err);
      return response.error(res, "Error interno al enviar expediente", 500);
    }
  },

  // Aprobar expediente (Coordinador)
  aprobar: async (req, res) => {
    try {
      const { id } = req.params;
      const id_coordinador = req.user.id_usuario;

      const data = await expedienteService.aprobar(parseInt(id), id_coordinador);
      return response.success(res, data);
    } catch (err) {
      console.error("ERROR APROBAR:", err);
      return response.error(res, err, 500);
    }
  },

  // Rechazar expediente (Coordinador)
  rechazar: async (req, res) => {
    try {
      const { id } = req.params;
      const { justificacion } = req.body;
      const id_coordinador = req.user.id_usuario;

      const data = await expedienteService.rechazar(parseInt(id), id_coordinador, justificacion);
      return response.success(res, data);
    } catch (err) {
      console.error("ERROR RECHAZAR:", err);
      return response.error(res, "Error interno al rechazar expediente", 500);
    }
  },

  // Listar expedientes}
  listarTodos: async (req, res) => {
    try {
      const { estado, inicio, fin } = req.query;

      const data = await expedienteService.listar(
        estado || null,
        inicio || null,
        fin || null,
        null  // coordinador ve todos
      );

      return response.success(res, data);
    } catch (err) {
      console.error("ERROR LISTAR EXPEDIENTES:", err);
      return response.error(res, "Error interno", 500);
    }
  },

  // Listar mis expedientes (Técnico)
  listarMisExpedientes: async (req, res) => {
    try {
      const id_tecnico = req.user.id_usuario;

      const data = await expedienteService.listar(
        null,   // estado
        null,   // inicio
        null,   // fin
        id_tecnico
      );

      return response.success(res, data);
    } catch (err) {
      console.error("ERROR LISTAR MIS EXPEDIENTES:", err);
      return response.error(res, "Error interno", 500);
    }
  }
};