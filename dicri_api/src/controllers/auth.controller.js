const service = require("../services/auth.service");
const { generarToken } = require("../utils/jwt");
const response = require("../utils/response");
const bcrypt = require("bcrypt");

module.exports = {
  login: async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
      // buscar usuario por correo
      const usuario = await service.login(correo);

      if (!usuario) {
        return response.error(res, "Correo o contraseña incorrectos", 401);
      }

      // validar password encriptado
      const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

      if (!passwordValida) {
        return response.error(res, "Correo o contraseña incorrectos", 401);
      }

      // generar token JWT
      const token = generarToken({
        id_usuario: usuario.id_usuario,
        id_rol: usuario.id_rol
      });

      delete usuario.contrasena; // no enviar hash al frontend

      return response.success(res, { usuario, token });

    } catch (err) {
      console.error(err);
      return response.error(res, "Error interno de autenticación", 500);
    }
  }
};