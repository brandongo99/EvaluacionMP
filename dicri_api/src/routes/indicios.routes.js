const router = require("express").Router();
const controller = require("../controllers/indicios.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Solo técnico puede registrar indicios
router.post("/", auth, role(["Tecnico"]), controller.crearIndicio);

module.exports = router;