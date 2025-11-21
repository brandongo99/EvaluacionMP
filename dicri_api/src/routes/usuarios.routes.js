const router = require("express").Router();
const controller = require("../controllers/usuarios.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Solo coordinador puede administrar usuarios
router.get("/", auth, role(["Coordinador"]), controller.listarUsuarios);
router.post("/", auth, role(["Coordinador"]), controller.crearUsuario);
router.put("/:id", auth, role(["Coordinador"]), controller.editarUsuario);
router.put("/:id/activar", auth, role(["Coordinador"]), controller.activarUsuario);
router.put("/:id/desactivar", auth, role(["Coordinador"]), controller.desactivarUsuario);

module.exports = router;