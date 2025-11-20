const router = require("express").Router();
const controller = require("../controllers/indicios.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Solo técnico puede registrar indicios
/**
 * @swagger
 * /api/indicios:
 *   post:
 *     summary: Registrar un nuevo indicio
 *     description: Permite a un técnico registrar un indicio asociado a un expediente. La descripción y el ID del expediente son obligatorios.
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Descripción del indicio
 *                 example: "Fragmento de vidrio encontrado en la escena"
 *               color:
 *                 type: string
 *                 description: Color del indicio
 *                 example: "Transparente"
 *               tamano:
 *                 type: string
 *                 description: Tamaño aproximado del indicio
 *                 example: "5 cm"
 *               peso:
 *                 type: number
 *                 format: float
 *                 description: Peso del indicio en gramos
 *                 example: 12.50
 *               ubicacion:
 *                 type: string
 *                 description: Ubicación donde se encontró el indicio
 *                 example: "Sala principal"
 *               id_expediente:
 *                 type: integer
 *                 description: ID del expediente al que pertenece el indicio
 *                 example: 15
 *             required:
 *               - descripcion
 *               - id_expediente
 *           examples:
 *             RegistrarIndicio:
 *               summary: Ejemplo de registro de indicio
 *               value:
 *                 descripcion: "Fragmento de vidrio encontrado en la escena"
 *                 color: "Transparente"
 *                 tamano: "5 cm"
 *                 peso: 12.50
 *                 ubicacion: "Sala principal"
 *                 id_expediente: 15
 *     responses:
 *       201:
 *         description: Indicio registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Indicio creado"
 *                 id_indicio:
 *                   type: integer
 *                   example: 101
 *       400:
 *         description: Error de validación (faltan datos obligatorios)
 *         content:
 *           application/json:
 *             example:
 *               error: "Descripción e id_expediente son obligatorios"
 *       403:
 *         description: No autorizado para registrar indicios
 *         content:
 *           application/json:
 *             example:
 *               error: "Acceso denegado (rol no permitido)"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno al crear indicio"
 */
router.post("/", auth, role(["Tecnico"]), controller.crearIndicio);

// Técnicos y coordinadores pueden consultar indicios por expediente
/**
 * @swagger
 * /api/indicios/{id_expediente}:
 *   get:
 *     summary: Listar indicios por expediente
 *     description: Devuelve todos los indicios asociados a un expediente. Disponible para técnicos y coordinadores.
 *     tags: [Indicios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_expediente
 *         required: true
 *         description: ID del expediente
 *         schema:
 *           type: integer
 *           example: 15
 *     responses:
 *       200:
 *         description: Lista de indicios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_indicio:
 *                     type: integer
 *                     example: 101
 *                   descripcion:
 *                     type: string
 *                     example: "Fragmento de vidrio encontrado en la escena"
 *                   color:
 *                     type: string
 *                     example: "Transparente"
 *                   tamano:
 *                     type: string
 *                     example: "5 cm"
 *                   peso:
 *                     type: number
 *                     example: 12.50
 *                   ubicacion:
 *                     type: string
 *                     example: "Sala principal"
 *                   fecha_registro:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-20T10:35:31"
 *                   tecnico:
 *                     type: string
 *                     example: "Juan Pérez"
 *       400:
 *         description: Falta el ID del expediente
 *         content:
 *           application/json:
 *             example:
 *               error: "Debe indicar el ID del expediente"
 *       403:
 *         description: No autorizado para consultar indicios
 *         content:
 *           application/json:
 *             example:
 *               error: "Acceso denegado (rol no permitido)"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno al listar indicios"
 */
router.get("/:id_expediente", auth, role(["Tecnico", "Coordinador"]), controller.listarPorExpediente);

module.exports = router;