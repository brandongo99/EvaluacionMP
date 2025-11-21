import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import api from "./utils/axiosInstance";
import logoSmall from './images/MP_logo.png';
import { saveTokens } from "./utils/authService";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Realizar la solicitud de inicio de sesión
    try {
      const response = await api.post("/auth/login", {
        correo,
        contrasena: password
      });

      console.log("Respuesta del servidor:", response.data);

      const { success, message, data } = response.data;

      // Si el inicio de sesión falla, limpiar tokens y mostrar error
      if (!success) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("usuario");

        setError("Error al iniciar sesión: " + message);
        return;
      }

      const { usuario, access_token, refresh_token } = data;

      // Guardar tokens y datos del usuario en el almacenamiento local
      saveTokens({ access_token, refresh_token });
      localStorage.setItem("usuario", JSON.stringify(usuario));

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión: " + err.response?.data?.message || err.message);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("usuario");
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-4">
          <img
            src={logoSmall}
            alt="BybKiosco"
            className="mb-3"
            style={{ maxHeight: "60px" }}
          />
          <p className="text-muted">Introduzca sus datos de usuario.</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">
              Correo de Empleado
            </label>
            <input
              type="email"
              id="correo"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ej: correo@dominio.com"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduzca su contraseña"
              required
            />
          </div>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <Button type="submit" variant="success" className="w-100">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;