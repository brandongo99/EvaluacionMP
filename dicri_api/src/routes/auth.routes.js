const router = require("express").Router();
const controller = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para autenticación, renovación de token y cierre de sesión
 */

// Endpoint de inicio de sesión
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica al usuario y devuelve tokens JWT (access y refresh).
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "usuario@dicri.gob.gt"
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *             required:
 *               - correo
 *               - contrasena
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   example:
 *                     id_usuario: 1
 *                     nombre: "Juan Pérez"
 *                     correo: "usuario@dicri.gob.gt"
 *                     id_rol: 2
 *                 access_token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refresh_token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             example:
 *               error: "Correo o contraseña incorrectos"
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno de autenticación"
 */
router.post("/login", controller.login);

// Endpoint de renovación de token
/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refrescar token
 *     description: Genera un nuevo access token usando el refresh token.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             required:
 *               - refresh_token
 *     responses:
 *       200:
 *         description: Nuevo access token generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Refresh token inválido o expirado
 *         content:
 *           application/json:
 *             example:
 *               error: "Refresh token inválido o expirado"
 */
router.post("/refresh", controller.refresh);

// Endpoint de cierre de sesión
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Invalida el access token y elimina el refresh token del usuario en Redis.
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Sesión cerrada correctamente"
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al cerrar sesión"
 */
router.post("/logout", controller.logout);

module.exports = router;