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
      return response.success(res, { data });
    } catch (err) {
      console.error("ERROR CREAR EXPEDIENTE:", err);
      return response.error(res, "Error interno al crear expediente", 500);
    }
  },

  // Cambia estado expediente
  cambiaEstado: async (req, res) => {
    try {
      const { id } = req.params;
      const { nuevo_estado, justificacion } = req.body;
      const id_usuario = req.user.id_usuario;
      const rol = req.user.id_rol;

      const estadosValidos = ["En revisión", "Aprobado", "Rechazado"];
      if (!estadosValidos.includes(nuevo_estado)) {
        return response.error(res, "Estado inválido", 400);
      }

      if (nuevo_estado === "En revisión" && rol !== 1) {
        return response.error(res, "Solo técnicos pueden enviar a revisión", 403);
      }
      if ((nuevo_estado === "Aprobado" || nuevo_estado === "Rechazado") && rol !== 2) {
        return response.error(res, "Solo coordinadores pueden aprobar o rechazar", 403);
      }

      if (nuevo_estado === "Rechazado" && !justificacion) {
        return response.error(res, "Debe indicar justificación para rechazar", 400);
      }

      const data = await expedienteService.cambiaEstado(parseInt(id), nuevo_estado, id_usuario, justificacion || null);
      return response.success(res, { data });
    } catch (err) {
      console.error("ERROR CAMBIAR ESTADO:", err);
      return response.error(res, "Error interno al cambiar estado", 500);
    }
  },

  // Listar expedientes (Coordinador ve todos, Técnico ve solo los suyos)
  listarExpedientes: async (req, res) => {
    try {
      const { estado, inicio, fin } = req.query;
      const id_usuario = req.user.id_usuario;
      const id_rol = req.user.id_rol;

      // Si es técnico, filtra por su ID; si es coordinador, ve todos
      const id_tecnico = id_rol === 1 ? id_usuario : null;

      const data = await expedienteService.listar(
        estado || null,
        inicio || null,
        fin || null,
        id_tecnico
      );

      return response.success(res, { data });
    } catch (err) {
      console.error("ERROR LISTAR EXPEDIENTES:", err);
      return response.error(res, "Error interno", 500);
    }
  },

  // Obtener siguiente número de expediente
  siguienteNumero: async (req, res) => {
    try {
      const data = await expedienteService.obtenerSiguienteNumero();
      return response.success(res, data);
    } catch (err) {
      console.error("ERROR OBTENER SIGUIENTE:", err);
      return response.error(res, "Error interno al obtener correlativo", 500);
    }
  }
};