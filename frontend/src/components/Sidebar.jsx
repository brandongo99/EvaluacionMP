import { NavLink } from "react-router-dom";
import logoSmall from '../images/BYB_Logo_Small.png';

const Sidebar = ({ collapsed = false }) => {
  return (
    <aside
      className={`navbar-vertical navbar ${collapsed ? "sidebar-hidden" : "sidebar-visible"}`}
    >
      <nav style={{ maxHeight: "100vh" }}>
        <div className="nav-scroller py-4">
          <div className="text-center mb-4">
            <img
              src={logoSmall}
              alt="BybKiosco"
              style={{ height: "40px" }}
              className="img-fluid"
            />
          </div>

          <div className="navbar-heading">Menú Principal</div>

          <ul className="navbar-nav flex-column accordion">
            <li className="nav-item mb-1">
              <NavLink to="/dashboard" className="nav-link">
                <i className="nav-icon fe fe-home me-2"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item mb-1">
              <NavLink to="/clinica" className="nav-link">
                <i className="nav-icon fe fe-activity me-2"></i> Clínica Médica
              </NavLink>
            </li>
            <li className="nav-item mb-1">
              <NavLink to="/gestiones" className="nav-link">
                <i className="nav-icon fe fe-briefcase me-2"></i> Gestiones RRHH
              </NavLink>
            </li>
            <li className="nav-item mb-1">
              <NavLink to="/ausencias" className="nav-link">
                <i className="nav-icon fe fe-calendar me-2"></i> Ausencias y Permisos
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
