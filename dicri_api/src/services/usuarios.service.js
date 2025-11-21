const { getConnection } = require("../config/db");
const sql = require("mssql");

module.exports = {
  listar: async (id_rol) => {
    const pool = await getConnection();

    const result = await pool.request()
      .input("PRol", sql.Int, id_rol || null)
      .execute("sp_Usuarios_Lista");

    return result.recordset;
  },

  crearUsuario: async ({ nombre, correo, contrasena, id_rol }) => {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("PNombre", sql.VarChar, nombre)
      .input("PCorreo", sql.VarChar, correo)
      .input("PContrasena", sql.VarChar, contrasena)
      .input("PRol", sql.Int, id_rol)
      .execute("sp_Usuario_Insertar");

    return result.recordset[0];
  },

  editarUsuario: async ({ id, nombre, correo, id_rol, contrasena }) => {
    const pool = await getConnection();
    const req = pool.request()
      .input("PId", sql.Int, id)
      .input("PNombre", sql.VarChar, nombre)
      .input("PCorreo", sql.VarChar, correo)
      .input("PRol", sql.Int, id_rol);

    if (contrasena) {
      req.input("PContrasena", sql.VarChar, contrasena);
    }

    await req.execute("sp_Usuario_Editar");

    return { actualizado: true };
  },

  activarUsuario: async (id) => {
    const pool = await getConnection();
    await pool.request()
      .input("PId", sql.Int, id)
      .execute("sp_Usuario_Activar");
  },

  desactivarUsuario: async (id) => {
    const pool = await getConnection();

    await pool.request()
      .input("PId", sql.Int, id)
      .execute("sp_Usuario_Desactivar");
  },
};