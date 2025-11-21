import { NavLink } from "react-router-dom";
import logoSmall from '../images/MP_logo_2.png';

const Sidebar = ({ collapsed = false }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rol = usuario?.id_rol;

  return (
    <aside
      className={`navbar-vertical navbar ${collapsed ? "sidebar-hidden" : "sidebar-visible"}`}
    >
      <nav style={{ maxHeight: "100vh" }}>
        <div className="nav-scroller py-4">
          
          {/* LOGO */}
          <div className="text-center mb-4">
            <img
              src={logoSmall}
              alt="DICRI"
              style={{ height: "60px" }}
              className="img-fluid"
            />
          </div>

          <div className="navbar-heading">Menú Principal</div>

          <ul className="navbar-nav flex-column accordion">

            {/* DASHBOARD */}
            <li className="nav-item mb-1">
              <NavLink to="/dashboard" className="nav-link">
                <i className="nav-icon fe fe-home me-2"></i> Dashboard
              </NavLink>
            </li>

            {/* EXPEDIENTES */}
            <li className="nav-item mb-1">
              <NavLink to="/expedientes" className="nav-link">
                <i className="nav-icon fe fe-folder me-2"></i> Expedientes
              </NavLink>
            </li>

            {/* REPORTES (solo coordinador) */}
            {rol === 2 && (
              <li className="nav-item mb-1">
                <NavLink to="/reportes" className="nav-link">
                  <i className="nav-icon fe fe-bar-chart me-2"></i> Reportes
                </NavLink>
              </li>
            )}

            {/* ADMINISTRACIÓN (opcional, solo coordinador) */}
            {rol === 2 && (
              <li className="nav-item mb-1">
                <NavLink to="/usuarios" className="nav-link">
                  <i className="nav-icon fe fe-users me-2"></i> Administración
                </NavLink>
              </li>
            )}

          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;