const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

module.exports = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ ok: false, message: "Token requerido" });
  }

  try {
    // Verificar si el token está en lista negra
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ ok: false, message: "Token invalidado (logout)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ ok: false, message: "Token expirado" });
    }
    return res.status(401).json({ ok: false, message: "Token inválido" });
  }
};