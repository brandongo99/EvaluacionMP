const router = require("express").Router();
const controller = require("../controllers/usuarios.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// Solo coordinador puede administrar usuarios
/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para administración de usuarios (solo coordinadores)
 */

// Listar usuarios
/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar usuarios
 *     description: Devuelve la lista de usuarios registrados. Solo accesible para coordinadores.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_rol
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filtrar usuarios por rol (opcional)
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                     example: 10
 *                   nombre:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   correo:
 *                     type: string
 *                     example: "juan@dicri.gob.gt"
 *                   id_rol:
 *                     type: integer
 *                     example: 2
 *                   activo:
 *                     type: boolean
 *                     example: true
 *       403:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               error: "Acceso denegado (rol no permitido)"
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al listar usuarios"
 */
router.get("/", auth, role(["Coordinador"]), controller.listarUsuarios);

// Crear usuario
/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear usuario
 *     description: Permite crear un nuevo usuario. Solo accesible para coordinadores.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               correo:
 *                 type: string
 *                 example: "juan@dicri.gob.gt"
 *               contrasena:
 *                 type: string
 *                 example: "123456"
 *               id_rol:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - nombre
 *               - correo
 *               - contrasena
 *               - id_rol
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             example:
 *               id_usuario: 15
 *               nombre: "Juan Pérez"
 *               correo: "juan@dicri.gob.gt"
 *               id_rol: 1
 *       400:
 *         description: Datos faltantes
 *         content:
 *           application/json:
 *             example:
 *               error: "Todos los campos son requeridos"
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al crear usuario"
 */
router.post("/", auth, role(["Coordinador"]), controller.crearUsuario);

// Editar usuario
/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Editar usuario
 *     description: Permite editar los datos de un usuario existente. Solo accesible para coordinadores.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID del usuario a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               correo:
 *                 type: string
 *                 example: "juan@dicri.gob.gt"
 *               contrasena:
 *                 type: string
 *                 example: "nueva123"
 *               id_rol:
 *                 type: integer
 *                 example: 2
 *             required:
 *               - nombre
 *               - correo
 *               - id_rol
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               actualizado: true
 *       400:
 *         description: Datos faltantes
 *         content:
 *           application/json:
 *             example:
 *               error: "Campos obligatorios faltantes"
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al editar usuario"
 */
router.put("/:id", auth, role(["Coordinador"]), controller.editarUsuario);

// Activar usuario
/**
 * @swagger
 * /api/usuarios/{id}/activar:
 *   put:
 *     summary: Activar usuario
 *     description: Activa un usuario deshabilitado. Solo accesible para coordinadores.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Usuario activado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario activado"
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al activar usuario"
 */
router.put("/:id/activar", auth, role(["Coordinador"]), controller.activarUsuario);

// Desactivar usuario
/**
 * @swagger
 * /api/usuarios/{id}/desactivar:
 *   put:
 *     summary: Desactivar usuario
 *     description: Desactiva un usuario activo. Solo accesible para coordinadores.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario desactivado"
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al desactivar usuario"
 */
router.put("/:id/desactivar", auth, role(["Coordinador"]), controller.desactivarUsuario);

module.exports = router;