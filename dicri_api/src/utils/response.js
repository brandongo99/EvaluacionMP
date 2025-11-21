module.exports = {
  // Función para enviar una respuesta exitosa
  success: (res, data, message = "Operación exitosa", status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  },

  // Función para enviar una respuesta de error
  error: (res, message = "Error interno", status = 500) => {
    return res.status(status).json({
      success: false,
      message
    });
  }
};
