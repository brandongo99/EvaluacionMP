const indicioService = require("../services/indicios.service");
const response = require("../utils/response");

module.exports = {
  // Método existente para crear un indicio
  crearIndicio: async (req, res) => {
    try {
      const {
        descripcion,
        color,
        tamano,
        peso,
        ubicacion,
        id_expediente
      } = req.body;

      const id_tecnico = req.user.id_usuario;

      if (!descripcion || !id_expediente) {
        return response.error(res, "Descripción e id_expediente son obligatorios", 400);
      }

      const data = await indicioService.crearIndicio({
        descripcion,
        color,
        tamano,
        peso,
        ubicacion,
        id_expediente,
        id_tecnico
      });

      return response.success(res, data);
    } catch (err) {
      console.error("ERROR CREAR INDICIO:", err);
      return response.error(res, "Error interno al crear indicio", 500);
    }
  },

  // Nuevo método para listar indicios por expediente
  listarPorExpediente: async (req, res) => {
    try {
      const { id_expediente } = req.params;

      if (!id_expediente) {
        return response.error(res, "Debe indicar el ID del expediente", 400);
      }

      const data = await indicioService.listarPorExpediente(parseInt(id_expediente));
      return response.success(res, data);
    } catch (err) {
      console.error("ERROR LISTAR INDICIOS:", err);
      return response.error(res, "Error interno al listar indicios", 500);
    }
  }
};