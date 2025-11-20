import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { useLoadingBar } from "react-top-loading-bar";
import RouteChangeHandler from "./RouteChangeHandler";
import { setLoadingHandlers } from "./utils/axiosConfig";
import { setNavigator } from "./utils/navigateService";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token") == "undefined" ? null : localStorage.getItem("access_token");
  const empleado = localStorage.getItem("empleado") == "undefined" ? null : localStorage.getItem("empleado");
  
  return token && empleado ? children : <Navigate to="/" replace />;
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;