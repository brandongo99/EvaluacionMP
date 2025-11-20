module.exports = function (rolesPermitidos) {
  return (req, res, next) => {
    const rolUsuario = req.user.id_rol;

    const mapaRoles = {
      1: "Tecnico",
      2: "Coordinador"
    };

    const rolNombre = mapaRoles[rolUsuario];

    if (!rolesPermitidos.includes(rolNombre)) {
      return res.status(403).json({
        ok: false,
        message: "Acceso denegado (rol no permitido)"
      });
    }

    next();
  };
};