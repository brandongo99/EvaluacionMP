const indicioService = require("../services/indicios.service");
const response = require("../utils/response");

module.exports = {
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
  }
};