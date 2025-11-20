const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');
const expedientesRoutes = require("./src/routes/expedientes.routes");
const indiciosRoutes = require('./src/routes/indicios.routes');
const swaggerDocs = require("./src/swagger/swagger");

const app = express();

app.use(cors());
app.use(express.json());
swaggerDocs(app);

app.use("/api/auth", authRoutes);
app.use("/api/expedientes", expedientesRoutes);
app.use("/api/indicios", indiciosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));

module.exports = app;