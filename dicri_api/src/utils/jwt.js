const jwt = require("jsonwebtoken");

// Función para generar un token de acceso
function generarAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
}

// Función para generar un token de refresco
function generarRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Función para verificar un token
function verificarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generarAccessToken, generarRefreshToken, verificarToken };