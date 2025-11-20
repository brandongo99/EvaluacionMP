const service = require("../services/auth.service");
const { generarAccessToken, generarRefreshToken, verificarToken } = require("../utils/jwt");
const response = require("../utils/response");
const bcrypt = require("bcrypt");
const redisClient = require("../config/redis"); // Configuración de Redis

module.exports = {
  // LOGIN
  login: async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
      const usuario = await service.login(correo);
      if (!usuario) return response.error(res, "Correo o contraseña incorrectos", 401);

      const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!passwordValida) return response.error(res, "Correo o contraseña incorrectos", 401);

      const access_token = generarAccessToken({ id_usuario: usuario.id_usuario, id_rol: usuario.id_rol });
      const refresh_token = generarRefreshToken({ id_usuario: usuario.id_usuario });

      // Guardar refresh token en Redis con expiración (7 días)
      await redisClient.set(`refresh:${usuario.id_usuario}`, refresh_token, { EX: 60 * 60 * 24 * 7 });

      delete usuario.contrasena;

      return response.success(res, { usuario, access_token, refresh_token });
    } catch (err) {
      console.error(err);
      return response.error(res, "Error interno de autenticación", 500);
    }
  },

  // REFRESH TOKEN
  refresh: async (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token) return response.error(res, "Refresh token requerido", 400);

    try {
      const decoded = verificarToken(refresh_token);

      // Validar que el refresh token esté en Redis
      const storedToken = await redisClient.get(`refresh:${decoded.id_usuario}`);
      if (!storedToken || storedToken !== refresh_token) {
        return response.error(res, "Refresh token inválido o expirado", 401);
      }

      const newAccessToken = generarAccessToken({ id_usuario: decoded.id_usuario, id_rol: decoded.id_rol });
      return response.success(res, { access_token: newAccessToken });
    } catch (err) {
      return response.error(res, "Refresh token inválido o expirado", 401);
    }
  },

  // LOGOUT
  logout: async (req, res) => {
    try {
      const { access_token } = req.body;
      const userId = req.user?.id_usuario;

      if (access_token) {
        // Agregar access token a lista negra en Redis con expiración igual al token
        await redisClient.set(`blacklist:${access_token}`, "true", { EX: 60 * 15 });
      }

      if (userId) {
        // Eliminar refresh token del usuario
        await redisClient.del(`refresh:${userId}`);
      }

      return response.success(res, { message: "Sesión cerrada correctamente" });
    } catch (err) {
      return response.error(res, "Error al cerrar sesión", 500);
    }
  }
};