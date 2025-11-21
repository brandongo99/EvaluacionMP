import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/axiosInstance";
import { Table, Button } from "react-bootstrap";
import { SelectPicker, DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { showAlert } from "../utils/Alerts";

const Reportes = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [tab, setTab] = useState(1);

  // Fechas iniciales: primer y último día del mes
  const hoy = new Date();
  const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

  const [fecha, setFecha] = useState([primerDia, ultimoDia]);
  const [estado, setEstado] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [tecSeleccionado, setTecSeleccionado] = useState(null);
  const [resultados, setResultados] = useState([]);

  // Cargar técnicos
  const cargarTecnicos = async () => {
    try {
      const res = await api.get("/usuarios?id_rol=1");

      const lista = Array.isArray(res.data?.data) ? res.data.data : [];

      const opciones = lista.map((x) => ({
        label: x.nombre,
        value: x.id_usuario,
      }));

      setTecnicos(opciones);
    } catch (err) {
      console.error("Error cargando técnicos:", err);
    }
  };

  // Buscar reportes
  const buscarReportes = async () => {
    try {
      const fInicio = fecha?.[0]
        ? fecha[0].toISOString().split("T")[0]
        : null;

      const fFin = fecha?.[1]
        ? fecha[1].toISOString().split("T")[0]
        : null;

      const res = await api.get("/reportes", {
        params: {
          tipoReporte: tab,
          fechaInicio: fInicio,
          fechaFin: fFin,
          idTecnico: tecSeleccionado || null,
          estado: estado || null
        },
      });

      const lista = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setResultados(lista);
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "No se pudo generar el reporte");
    }
  };

  // Cambiar tab limpia filtros
  useEffect(() => {
    setResultados([]);
    setEstado(null);
    setTecSeleccionado(null);
  }, [tab]);

  useEffect(() => {
    cargarTecnicos();
  }, []);

  // Helper para formatear fechas
  const fmt = (f) =>
    f ? new Date(f).toLocaleString("es-GT") : "-";

  return (
    <Layout>
      <div className="container-fluid p-3">
        <h3 className="fw-bold mb-4">Reportes del Sistema</h3>

        {/* ------------------ TABS ------------------ */}
        <ul className="nav nav-tabs mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <li className="nav-item" key={i}>
              <button
                className={`nav-link ${tab === i ? "active" : ""}`}
                onClick={() => setTab(i)}
              >
                {i}. {
                  ["Expedientes por técnico", "KPI Forenses", "Revisiones", "Actividad del usuario", "Reporte General"][i - 1]
                }
              </button>
            </li>
          ))}
        </ul>

        {/* ------------------ FILTROS ------------------ */}
        <div className="card mb-4">
          <div className="card-body row">

            <div className="col-md-4 mb-3">
              <label className="form-label">Rango de Fechas</label>
              <DateRangePicker
                format="yyyy-MM-dd"
                value={fecha}
                onChange={setFecha}
                character=" a "
                placement="bottomStart"
                block
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Estado</label>
              <SelectPicker
                data={[
                  { label: "Registrado", value: "Registrado" },
                  { label: "En revisión", value: "En revisión" },
                  { label: "Aprobado", value: "Aprobado" },
                  { label: "Rechazado", value: "Rechazado" },
                ]}
                value={estado}
                onChange={setEstado}
                placeholder="Todos"
                cleanable
                searchable={false}
                block
              />
            </div>

            {/* Mostrar técnico solo en reportes 1 y 4 */}
            {(tab === 1 || tab === 4) && (
              <div className="col-md-3 mb-3">
                <label className="form-label">Técnico</label>
                <SelectPicker
                  data={tecnicos}
                  value={tecSeleccionado}
                  onChange={setTecSeleccionado}
                  placeholder="Todos"
                  cleanable
                  block
                />
              </div>
            )}

            <div className="col-md-2 mb-3 d-flex align-items-end">
              <Button className="w-100" onClick={buscarReportes}>
                Buscar
              </Button>
            </div>

          </div>
        </div>

        {/* ------------------ TABLA ------------------ */}
        <Table bordered hover responsive className="table-nowrap">
          <thead className="table-light">
            {tab === 1 && (
              <tr>
                <th>ID</th>
                <th>Expediente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Técnico</th>
              </tr>
            )}

            {tab === 2 && (
              <tr>
                <th>ID</th>
                <th>Expediente</th>
                <th>Registro</th>
                <th>Envío</th>
                <th>Revisión</th>
                <th>Horas Envío</th>
                <th>Horas Revisión</th>
                <th>Técnico</th>
                <th>Coordinador</th>
              </tr>
            )}

            {tab === 3 && (
              <tr>
                <th>ID</th>
                <th>Expediente</th>
                <th>Fecha Revisión</th>
                <th>Resultado</th>
                <th>Justificación</th>
                <th>Coordinador</th>
              </tr>
            )}

            {tab === 4 && (
              <tr>
                <th>Tipo</th>
                <th>ID</th>
                <th>Expediente</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Justificación</th>
              </tr>
            )}

            {tab === 5 && (
              <tr>
                <th>ID</th>
                <th>Expediente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Técnico</th>
                <th>Justificación</th>
              </tr>
            )}
          </thead>

          <tbody>
            {resultados.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-3">
                  Sin resultados
                </td>
              </tr>
            ) : (
              resultados.map((r, i) => (
                <tr key={i}>
                  {tab === 1 && (
                    <>
                      <td>{r.id_expediente}</td>
                      <td>{r.numero_expediente}</td>
                      <td>{fmt(r.fecha_registro)}</td>
                      <td>{r.estado}</td>
                      <td>{r.tecnico}</td>
                    </>
                  )}

                  {tab === 2 && (
                    <>
                      <td>{r.id_expediente}</td>
                      <td>{r.numero_expediente}</td>
                      <td>{fmt(r.fecha_registro)}</td>
                      <td>{fmt(r.fecha_envio)}</td>
                      <td>{fmt(r.fecha_revision)}</td>
                      <td>{r.horas_a_envio}</td>
                      <td>{r.horas_a_revision}</td>
                      <td>{r.tecnico}</td>
                      <td>{r.coordinador}</td>
                    </>
                  )}

                  {tab === 3 && (
                    <>
                      <td>{r.id_revision}</td>
                      <td>{r.numero_expediente}</td>
                      <td>{fmt(r.fecha_revision)}</td>
                      <td>{r.resultado}</td>
                      <td>{r.justificacion}</td>
                      <td>{r.coordinador}</td>
                    </>
                  )}

                  {tab === 4 && (
                    <>
                      <td>{r.tipo}</td>
                      <td>{r.id_expediente || r.id_indicio || r.id_log}</td>
                      <td>{r.numero_expediente}</td>
                      <td>{fmt(r.fecha)}</td>
                      <td>{r.descripcion}</td>
                      <td>{r.estado}</td>
                      <td>{r.justificacion}</td>
                    </>
                  )}

                  {tab === 5 && (
                    <>
                      <td>{r.id_expediente}</td>
                      <td>{r.numero_expediente}</td>
                      <td>{fmt(r.fecha_registro)}</td>
                      <td>{r.estado}</td>
                      <td>{r.tecnico}</td>
                      <td>{r.justificacion_rechazo}</td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
};

export default Reportes;