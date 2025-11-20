const router = require("express").Router();
const controller = require("../controllers/expedientes.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// TECNICO → crear expediente
/**
 * @swagger
 * /api/expedientes:
 *   post:
 *     summary: Crear un nuevo expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_expediente:
 *                 type: string
 *                 example: "EXP-001-2025"
 *     responses:
 *       200:
 *         description: Expediente creado
 */
router.post("/", auth, role(["Tecnico"]), controller.crearExpediente);

// TECNICO → enviar expediente
router.put("/:id/enviar", auth, role(["Tecnico"]), controller.enviarRevision);

// COORDINADOR → aprobar
/**
 * @swagger
 * /api/expedientes/{id}/aprobar:
 *   put:
 *     summary: Aprobar expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del expediente
 *     responses:
 *       200:
 *         description: Expediente aprobado correctamente
 */
router.put("/:id/aprobar", auth, role(["Coordinador"]), controller.aprobar);

// COORDINADOR → rechazar
router.put("/:id/rechazar", auth, role(["Coordinador"]), controller.rechazar);

// COORDINADOR → listar todos los expedientes
router.get("/", auth, role(["Coordinador"]), controller.listarTodos);

// TECNICO → listar mis expedientes
router.get("/mis", auth, role(["Tecnico"]), controller.listarMisExpedientes);

// TÉCNICO → enviar expediente a revisión
router.put("/:id/enviar", auth, role(["Tecnico"]), controller.enviarRevision);

module.exports = router;