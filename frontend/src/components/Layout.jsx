import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div>
            <div id="db-wrapper" className={collapsed ? "toggled" : ""}>
                {/* Sidebar */}
                <div className="navbar-vertical navbar">
                    <Sidebar collapsed={collapsed} />
                </div>

                {/* Contenedor principal estilo */}
                <div id="page-content">
                    {/* Top Navbar */}
                    <div className="header">
                        <Navbar onToggleSidebar={() => setCollapsed(!collapsed)} />
                    </div>

                    {/* Contenido dinámico */}
                    <main className="p-4 bg-white">
                        {children}                        
                    </main>

                    {/* Footer */}
                    <div className="px-6 border-top py-3">
                        <div className="row">
                            <div className="col-sm-6 text-center text-sm-start mb-2 mb-sm-0">
                                <p className="m-0">
                                    <b>Brandon Godinez ©</b> Todos los derechos reservados. <b>DICRI V.1.0</b>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Layout;
