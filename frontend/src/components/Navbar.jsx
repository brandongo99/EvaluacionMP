import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { getAccessToken } from "../utils/authService";

const Navbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        logout();
        localStorage.removeItem("usuario");     
        
        navigate("/");
    };

    // Función para realizar la solicitud de logout al backend
    const logout = async () => {
        try {
            const response = await api.post("/auth/logout", {}, {
                access_token: getAccessToken()
            });

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("usuario");
        } catch (error) {
      console.error("Error en la solicitud de logout", error);
    }
  };

    return (
        <nav className="navbar-classic navbar navbar-expand-lg navbar-expand navbar-light navbar-top fixed-top">
            <div className="d-flex justify-content-between w-100">
                {/* Botón de menú (sidebar toggle) */}
                <div className="d-flex align-items-center">
                    <span
                        role="button"
                        tabIndex={0}
                        className="nav-icon me-2 icon-xs"
                        onClick={onToggleSidebar}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggleSidebar()}
                    >
                        <i className="fe fe-menu" ></i>
                    </span>
                    <span className="fw-bold fs-4 text-success">Portal DICRI</span>
                </div>

                {/* Menú derecho */}
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                        <i className="fe fe-log-out me-1"></i> Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
