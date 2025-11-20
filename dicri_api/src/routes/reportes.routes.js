const router = require("express").Router();
const controller = require("../controllers/reportes.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Solo coordinadores pueden consultar reportes
/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Obtener reportes dinámicos del sistema
 *     description: |
 *       Genera diferentes tipos de reportes según el parámetro `tipoReporte`. Permite filtrar por fechas, técnico, coordinador, expediente y estado.
 *       <br>
 *       **Tipos de reporte disponibles:**
 *       - 1: Expedientes por técnico
 *       - 2: KPI forenses (tiempos entre registro, envío y revisión)
 *       - 3: Reporte de revisiones (aprobados/rechazados)
 *       - 4: Actividad de técnico/coordinador (expedientes, indicios, cambios de estado)
 *       - 5: Expedientes (general, por estado, fechas, técnico)
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipoReporte
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3, 4, 5]
 *         description: Tipo de reporte a generar
 *       - in: query
 *         name: fechaInicio
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (YYYY-MM-DD)
 *       - in: query
 *         name: idTecnico
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID del técnico (para filtrar)
 *       - in: query
 *         name: idCoordinador
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID del coordinador (para filtrar)
 *       - in: query
 *         name: idExpediente
 *         required: false
 *         schema:
 *           type: integer
 *         description: ID del expediente (para reportes específicos)
 *       - in: query
 *         name: estado
 *         required: false
 *         schema:
 *           type: string
 *           example: "Aprobado"
 *         description: Estado del expediente (Registrado, En revisión, Aprobado y Rechazado)
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: El formato depende del tipo de reporte solicitado.
 *       400:
 *         description: Parámetros inválidos o faltantes
 *         content:
 *           application/json:
 *             example:
 *               error: "El parámetro tipoReporte es obligatorio"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno al generar el reporte"
 */
router.get("/", auth, role(["Coordinador"]), controller.obtenerReporte);

module.exports = router;