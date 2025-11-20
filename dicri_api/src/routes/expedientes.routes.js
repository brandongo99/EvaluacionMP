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
 *     description: Permite a un técnico crear un expediente en el sistema. El número de expediente es obligatorio.
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
 *                 description: Número único del expediente
 *                 example: "EXP-001-2025"
 *             required:
 *               - numero_expediente
 *           examples:
 *             CrearExpediente:
 *               summary: Ejemplo de creación
 *               value:
 *                 numero_expediente: "EXP-001-2025"
 *     responses:
 *       201:
 *         description: Expediente creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expediente creado"
 *                 id_expediente:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Error de validación (faltan datos obligatorios)
 *         content:
 *           application/json:
 *             example:
 *               error: "El número de expediente es obligatorio"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno al crear expediente"
 */
router.post("/", auth, role(["Tecnico"]), controller.crearExpediente);

// TECNICO/COORDINADOR → cambiar estado expediente
/**
 * @swagger
 * /api/expedientes/{id}/estado:
 *   put:
 *     summary: Cambiar estado del expediente (Enviar a Revisión, Aprobar o Rechazar)
 *     description: Permite cambiar el estado de un expediente. Solo los técnicos pueden enviar a revisión y solo los coordinadores pueden aprobar o rechazar.
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del expediente
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nuevo_estado:
 *                 type: string
 *                 enum: [En revisión, Aprobado, Rechazado]
 *                 description: Estado al que se desea cambiar el expediente
 *               justificacion:
 *                 type: string
 *                 description: Justificación (obligatoria si el estado es "Rechazado")
 *             required:
 *               - nuevo_estado
 *           examples:
 *             EnviarRevision:
 *               summary: Enviar a revisión
 *               value:
 *                 nuevo_estado: "En revisión"
 *             Aprobar:
 *               summary: Aprobar expediente
 *               value:
 *                 nuevo_estado: "Aprobado"
 *             Rechazar:
 *               summary: Rechazar expediente
 *               value:
 *                 nuevo_estado: "Rechazado"
 *                 justificacion: "Faltan documentos"
 *     responses:
 *       200:
 *         description: Estado del expediente actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Expediente aprobado"
 *                 resultado:
 *                   type: object
 *                   example:
 *                     resultado: "OK"
 *       400:
 *         description: Error de validación (estado inválido o falta de justificación)
 *         content:
 *           application/json:
 *             example:
 *               error: "Debe indicar justificación para rechazar"
 *       403:
 *         description: No autorizado para realizar esta acción
 *         content:
 *           application/json:
 *             example:
 *               error: "Solo coordinadores pueden aprobar o rechazar"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno al cambiar estado del expediente"
 */
router.put("/:id/estado", auth, role(["Tecnico", "Coordinador"]), controller.cambiaEstado);

// COORDINADOR y TECNICO → listar expedientes (con filtros opcionales)
/**
 * @swagger
 * /api/expedientes:
 *   get:
 *     summary: Listar expedientes
 *     description: Permite listar expedientes. Los coordinadores ven todos los expedientes, los técnicos solo ven los suyos. Se pueden aplicar filtros opcionales por estado y rango de fechas.
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         required: false
 *         description: Filtrar por estado del expediente
 *         schema:
 *           type: string
 *           enum: [Registrado, En revisión, Aprobado, Rechazado]
 *           example: "Registrado"
 *       - in: query
 *         name: inicio
 *         required: false
 *         description: Fecha de inicio del rango (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *       - in: query
 *         name: fin
 *         required: false
 *         description: Fecha de fin del rango (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Lista de expedientes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_expediente:
 *                     type: integer
 *                     example: 15
 *                   numero_expediente:
 *                     type: string
 *                     example: "EXP-001-2025"
 *                   estado:
 *                     type: string
 *                     example: "En revisión"
 *                   fecha_creacion:
 *                     type: string
 *                     format: date
 *                     example: "2025-11-20"
 *       403:
 *         description: No autorizado para listar expedientes
 *         content:
 *           application/json:
 *             example:
 *               error: "Acceso denegado (rol no permitido)"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno al listar expedientes"
 */
router.get("/", auth, role(["Tecnico", "Coordinador"]), controller.listarExpedientes);

module.exports = router;