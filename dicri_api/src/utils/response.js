module.exports = {
  success: (res, data, message = "Operación exitosa", status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  },

  error: (res, message = "Error interno", status = 500) => {
    return res.status(status).json({
      success: false,
      message
    });
  }
};
