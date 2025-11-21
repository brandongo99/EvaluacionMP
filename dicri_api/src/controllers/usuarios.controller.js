const usuarioService = require("../services/usuarios.service");
const bcrypt = require("bcrypt");
const response = require("../utils/response");

module.exports = {
  listarUsuarios: async (req, res) => {
    try {
      const { id_rol } = req.query; // opcional
      const data = await usuarioService.listar(id_rol);
      return response.success(res, data);
    } catch (err) {
      console.error("ERROR LISTAR USUARIOS:", err);
      return response.error(res, "Error al listar usuarios", 500);
    }
  },

  crearUsuario: async (req, res) => {
    try {
      const { nombre, correo, contrasena, id_rol } = req.body;

      if (!nombre || !correo || !contrasena || !id_rol) {
        return response.error(res, "Todos los campos son requeridos", 400);
      }

      const hashed = await bcrypt.hash(contrasena, 10);

      const nuevo = await usuarioService.crearUsuario({
        nombre,
        correo,
        contrasena: hashed,
        id_rol
      });

      return response.success(res, nuevo);
    } catch (err) {
      console.error("ERROR CREAR USUARIO:", err);
      return response.error(res, "Error al crear usuario", 500);
    }
  },

  editarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, correo, contrasena, id_rol } = req.body;

      if (!nombre || !correo || !id_rol)
        return response.error(res, "Campos obligatorios faltantes", 400);

      let hashed = null;
      if (contrasena) {
        hashed = await bcrypt.hash(contrasena, 10);
      }

      const data = await usuarioService.editarUsuario({
        id,
        nombre,
        correo,
        id_rol,
        contrasena: hashed,
      });

      return response.success(res, data);
    } catch (err) {
      console.error("ERROR EDITAR USUARIO:", err);
      return response.error(res, "Error al editar usuario", 500);
    }
  },

  activarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      await usuarioService.activarUsuario(id);
      return response.success(res, { message: "Usuario activado" });
    } catch (err) {
      console.error("ERROR ACTIVAR:", err);
      return response.error(res, "Error al activar usuario", 500);
    }
  },

  desactivarUsuario: async (req, res) => {
    try {
      const { id } = req.params;

      await usuarioService.desactivarUsuario(id);

      return response.success(res, { message: "Usuario desactivado" });
    } catch (err) {
      console.error("ERROR DESACTIVAR USUARIO:", err);
      return response.error(res, "Error al desactivar usuario", 500);
    }
  },
};
