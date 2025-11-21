import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import Expedientes from "./pages/Expedientes";
import ExpedienteDetalle from "./pages/ExpedienteDetalle";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";
import { useEffect } from "react";
import { useLoadingBar } from "react-top-loading-bar";
import RouteChangeHandler from "./RouteChangeHandler";
import { setLoadingHandlers } from "./utils/axiosConfig";
import { setNavigator } from "./utils/navigateService";

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  const usuario = localStorage.getItem("usuario");
  
  return token && usuario ? children : <Navigate to="/" replace />;
};

function App() {
  const { start, complete } = useLoadingBar();

  const navigate = useNavigate();
  setNavigator(navigate);

  useEffect(() => {
    setLoadingHandlers(start, complete);
  }, []);

  return (
    <>
      <RouteChangeHandler />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expedientes"
          element={
            <ProtectedRoute>
              <Expedientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expedientes/:id"
          element={
            <ProtectedRoute>
              <ExpedienteDetalle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;