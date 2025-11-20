const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DICRI API",
      version: "1.0.0",
      description: "Documentación de la API del sistema DICRI (Expedientes e Indicios)"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo"
      }
    ]
  },
  apis: [
    "./src/routes/*.js",
    "./src/swagger/*.yaml"
  ],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // archivo JSON (opcional)
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log("Swagger habilitado en: http://localhost:3000/api/docs");
}

module.exports = swaggerDocs;