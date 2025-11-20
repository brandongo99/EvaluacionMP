module.exports = {
  success: (res, data) => res.json({ ok: true, data }),
  error: (res, message, code = 400) => res.status(code).json({ ok: false, message })
};