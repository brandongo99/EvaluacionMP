import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import Layout from "../components/Layout";
import { Table, Button, Badge } from "react-bootstrap";

const Dashboard = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rol = usuario?.id_rol; // 1 = técnico, 2 = coordinador

  const [kpis, setKpis] = useState({
    totalExpedientes: 0,
    enRevision: 0,
    rechazados: 0,
    aprobados: 0,
    indicios: 0,
  });

  const [ultimosExpedientes, setUltimosExpedientes] = useState([]);

  // Obtener métricas desde backend
  const cargarDatos = async () => {
    try {
      const res = await api.get("/expedientes"); // trae todos o solo los del técnico según rol
      const lista = Array.isArray(res.data?.data?.data)
        ? res.data.data.data
        : [];

      // KPIs base
      let total = lista.length;
      let enRevision = lista.filter((x) => x.estado === "En revisión").length;
      let rechazados = lista.filter((x) => x.estado === "Rechazado").length;
      let aprobados = lista.filter((x) => x.estado === "Aprobado").length;

      // Contar indicios
      const totalIndicios = lista.reduce(
        (acc, exp) => acc + (exp.cantidad_indicios || 0), 
        0
      );

      // Ultimos expedientes según rol
      let ultimos = lista
        .sort(
          (a, b) =>
            new Date(b.fecha_registro) - new Date(a.fecha_registro)
        )
        .slice(0, 5);

      // Coordenador → solo ver en revisión
      if (rol === 2) {
        ultimos = lista
          .filter((x) => x.estado === "En revisión")
          .sort(
            (a, b) =>
              new Date(b.fecha_registro) - new Date(a.fecha_registro)
          )
          .slice(0, 5);
      }

      setKpis({
        totalExpedientes: total,
        enRevision,
        rechazados,
        aprobados,
        indicios: totalIndicios,
      });

      setUltimosExpedientes(ultimos);
    } catch (err) {
      console.error("Error cargando dashboard:", err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <Layout>
      <div className="container-fluid p-3">

        <h3 className="fw-bold mb-4">Dashboard</h3>

        {/* TARJETAS KPI */}
        <div className="row">

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5>Total Expedientes</h5>
                <h2 className="fw-bold">{kpis.totalExpedientes}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5>En Revisión</h5>
                <h2 className="fw-bold text-warning">{kpis.enRevision}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5>Aprobados</h5>
                <h2 className="fw-bold text-success">{kpis.aprobados}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5>Rechazados</h5>
                <h2 className="fw-bold text-danger">{kpis.rechazados}</h2>
              </div>
            </div>
          </div>

          {/* Indicadores de indicios */}
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5>Total Indicios</h5>
                <h2 className="fw-bold">{kpis.indicios}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN SOLO PARA TÉCNICO */}
        {rol === 1 && (
          <>
            <h4 className="mt-4 mb-3">Mis últimos expedientes</h4>

            <Table responsive bordered hover>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Número</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Indicios</th>
                </tr>
              </thead>

              <tbody>
                {ultimosExpedientes.map((exp, idx) => (
                  <tr key={exp.id_expediente}>
                    <td>{idx + 1}</td>
                    <td>{exp.numero_expediente}</td>
                    <td>
                      <Badge
                        bg={
                          exp.estado === "Aprobado"
                            ? "success"
                            : exp.estado === "Rechazado"
                            ? "danger"
                            : exp.estado === "En revisión"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {exp.estado}
                      </Badge>
                    </td>
                    <td>{new Date(exp.fecha_registro).toLocaleString()}</td>
                    <td>{exp.cantidad_indicios}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {/* SECCIÓN SOLO PARA COORDINADOR */}
        {rol === 2 && (
          <>
            <h4 className="mt-4 mb-3">Expedientes Pendientes de Revisión</h4>

            <Table responsive bordered hover>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Número</th>
                  <th>Técnico</th>
                  <th>Fecha</th>
                  <th>Indicios</th>
                </tr>
              </thead>

              <tbody>
                {ultimosExpedientes.map((exp, idx) => (
                  <tr key={exp.id_expediente}>
                    <td>{idx + 1}</td>
                    <td>{exp.numero_expediente}</td>
                    <td>{exp.tecnico}</td>
                    <td>{new Date(exp.fecha_registro).toLocaleString()}</td>
                    <td>{exp.cantidad_indicios}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;