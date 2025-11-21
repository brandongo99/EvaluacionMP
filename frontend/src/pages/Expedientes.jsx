import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../utils/axiosInstance";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { format } from "date-fns";
import { showAlert } from "../utils/Alerts";

const Expedientes = () => {
  const navigate = useNavigate();
  
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rol = usuario?.id_rol;

  const hoy = new Date();
  const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const [expedientes, setExpedientes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [inicioFiltro, setInicioFiltro] = useState(formatDate(primerDia));
  const [finFiltro, setFinFiltro] = useState(formatDate(ultimoDia));

  // Modal crear expediente
  const [showModal, setShowModal] = useState(false);
  const [numeroExpediente, setNumeroExpediente] = useState("");

  // Modal indicios
  const [showIndiciosModal, setShowIndiciosModal] = useState(false);
  const [indiciosExpediente, setIndiciosExpediente] = useState([]);
  const [expSeleccionado, setExpSeleccionado] = useState(null);

  // Modal rechazar expediente
  const [showRechazoModal, setShowRechazoModal] = useState(false);
  const [justificacion, setJustificacion] = useState("");
  const [expedienteARechazar, setExpedienteARechazar] = useState(null);

  const cargarExpedientes = async () => {
    try {
      const params = {};
      if (estadoFiltro) params.estado = estadoFiltro;
      if (inicioFiltro) params.inicio = inicioFiltro;
      if (finFiltro) params.fin = finFiltro;

      const res = await api.get("/expedientes", { params });
      const { success, data } = res.data;

      if (success) {
        setExpedientes(data.data);
    }
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "No se pudieron cargar los expedientes");
    }
  };

  useEffect(() => {
    cargarExpedientes();
  }, []);

  const handleCrearExpediente = async () => {
    if (!numeroExpediente.trim()) {
      return showAlert("warning", "Dato requerido", "Debe ingresar un número de expediente.");
    }

    if (!/^EXP-\d{3}-\d{4}$/.test(numeroExpediente)) {
      return showAlert('warning', 'Formato incorrecto', 'Use el formato: EXP-000-2025');
    }

    const res = await api.get("/expedientes/siguiente");
    const esperado = res.data?.data?.siguiente;

    if (numeroExpediente !== esperado) {
        return showAlert("warning", "Número inválido", `El expediente correcto es: ${esperado}`);
    }

    try {
      await api.post("/expedientes", { numero_expediente: numeroExpediente });

      showAlert("success", "Éxito", "Expediente creado.");
      setShowModal(false);
      setNumeroExpediente("");
      cargarExpedientes();
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "No se pudo crear el expediente");
    }
  };

  const obtenerSiguiente = async () => {
    try {
        const res = await api.get("/expedientes/siguiente");
        const sugerido = res.data?.data?.siguiente || "";
        setNumeroExpediente(sugerido);
    } catch (err) {
        console.error(err);
    }
  };

  const cambiarEstado = async (id, nuevo_estado, justificacion = null) => {
    let data = { nuevo_estado };

    if (nuevo_estado === "Rechazado") {
        if (!justificacion || !justificacion.trim()) {
        return showAlert("warning", "Dato requerido", "Debe ingresar una justificación.");
        }
        data.justificacion = justificacion;
    }

    try {
        await api.put(`/expedientes/${id}/estado`, data);
        showAlert("success", "Éxito", `Expediente ${nuevo_estado}`);
        cargarExpedientes();
    } catch (err) {
        console.error(err);
        showAlert("error", "Error", "No se pudo cambiar el estado");
    }
  };

  const abrirModal = () => {
    setShowModal(true);
    obtenerSiguiente();
  };

  const cargarIndiciosExpediente = async (id_expediente) => {
    try {
        const res = await api.get(`/indicios/${id_expediente}`);

        const lista = Array.isArray(res.data?.data?.data)
        ? res.data.data.data
        : [];

        setIndiciosExpediente(lista);
    } catch (err) {
        console.error(err);
        showAlert("error", "Error", "No se pudieron cargar los indicios");
    }
  };

  return (
    <Layout>
      <div className="p-3 container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
              <h3 className="mb-0 fw-bold">Expedientes</h3>

              {rol === 1 && (
                <Button variant="success" onClick={() => abrirModal()}>
                  + Crear Expediente
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="card mb-4">
          <div className="card-body row g-3">
            <div className="col-sm-3">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Registrado">Registrado</option>
                <option value="En revisión">En revisión</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>

            <div className="col-sm-3">
              <label className="form-label">Inicio</label>
              <input
                type="date"
                className="form-control"
                value={inicioFiltro}
                onChange={(e) => setInicioFiltro(e.target.value)}
              />
            </div>

            <div className="col-sm-3">
              <label className="form-label">Fin</label>
              <input
                type="date"
                className="form-control"
                value={finFiltro}
                onChange={(e) => setFinFiltro(e.target.value)}
              />
            </div>

            <div className="col-sm-3 d-flex align-items-end">
              <Button variant="primary" className="w-100" onClick={cargarExpedientes}>
                Buscar
              </Button>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="card">
          <div className="card-body">
            <Table responsive hover className="text-nowrap">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Número</th>
                  <th>Técnico</th>
                  <th>Cant. Indicios</th>
                  <th>Fecha Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(expedientes) && expedientes.map((exp, i) => (
                  <tr key={exp.id_expediente}>
                    <td>{i + 1}</td>
                    <td>{exp.numero_expediente}</td>
                    <td>{exp.tecnico}</td>
                    <td>{exp.cantidad_indicios}</td>
                    <td>{format(new Date(exp.fecha_registro), "dd/MM/yyyy")}</td>

                    <td>
                      {exp.estado === "Registrado" && (
                        <span className="badge bg-secondary">Registrado</span>
                      )}
                      {exp.estado === "En revisión" && (
                        <span className="badge bg-warning">En revisión</span>
                      )}
                      {exp.estado === "Aprobado" && (
                        <span className="badge bg-success">Aprobado</span>
                      )}
                      {exp.estado === "Rechazado" && (
                        <span className="badge bg-danger">Rechazado</span>
                      )}
                    </td>

                    <td>
                      {/* Si es técnico */}
                      {rol === 1 && (
                        <>
                          <Button
                            disabled={exp.cantidad_indicios === 0}
                            size="sm"
                            variant="info"
                            className="me-2"
                            onClick={() => {
                              setExpSeleccionado(exp);
                              cargarIndiciosExpediente(exp.id_expediente); 
                              setShowIndiciosModal(true);
                            }}
                          >
                            Indicios
                          </Button>
                          {exp.estado === "Registrado" && (
                            <>
                              <Button
                                disabled={exp.cantidad_indicios === 0}
                                size="sm"
                                variant="primary"
                                onClick={() => exp.cantidad_indicios > 0 && cambiarEstado(exp.id_expediente, "En revisión")}
                              >
                              Enviar
                              </Button>
                            </>
                          )}
                        </>
                      )}

                      {/* Si es coordinador */}
                      {rol === 2 && exp.estado === "En revisión" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => cambiarEstado(exp.id_expediente, "Aprobado")}
                          >
                            Aprobar
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                                setExpedienteARechazar(exp.id_expediente);
                                setJustificacion("");
                                setShowRechazoModal(true);
                            }}
                          >
                            Rechazar
                          </Button>
                        </>
                      )}

                      {/* Ver detalle (ambos roles) */}
                      <Button
                        size="sm"
                        variant="outline-dark"
                        className="ms-2"
                        onClick={() => navigate(`/expedientes/${exp.id_expediente}`)}
                      >
                      Detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* MODAL CREAR EXPEDIENTE */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Expediente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Número de Expediente</Form.Label>
            <Form.Control
              type="text"
              value={numeroExpediente}
              placeholder="EXP-000-2025"
              onChange={(e) => setNumeroExpediente(e.target.value)}
              isInvalid={numeroExpediente && !/^EXP-\d{3}-\d{4}$/.test(numeroExpediente)}
            />
            <Form.Control.Feedback type="invalid">
              Formato inválido. Ejemplo: EXP-001-2025
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleCrearExpediente}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL INDICIOS */}
      <Modal
        show={showIndiciosModal}
        onHide={() => setShowIndiciosModal(false)}
        size="lg"
        centered
        >
        <Modal.Header closeButton>
            <Modal.Title>
            Indicios del Expediente: {expSeleccionado?.numero_expediente}
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {indiciosExpediente.length === 0 ? (
            <div className="alert alert-info text-center">
                No hay indicios registrados para este expediente.
            </div>
            ) : (
            <Table striped bordered hover responsive className="text-nowrap">
                <thead className="table-light">
                <tr>
                    <th>#</th>
                    <th>Descripción</th>
                    <th>Color</th>
                    <th>Tamaño</th>
                    <th>Peso</th>
                    <th>Ubicación</th>
                    <th>Fecha Registro</th>
                    <th>Técnico</th>
                </tr>
                </thead>

                <tbody>
                {indiciosExpediente.map((ind, idx) => (
                    <tr key={ind.id_indicio}>
                    <td>{idx + 1}</td>
                    <td>{ind.descripcion}</td>
                    <td>{ind.color}</td>
                    <td>{ind.tamano}</td>
                    <td>{ind.peso}</td>
                    <td>{ind.ubicacion}</td>
                    <td>{new Date(ind.fecha_registro).toLocaleString()}</td>
                    <td>{ind.tecnico}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            )}
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowIndiciosModal(false)}>
            Cerrar
            </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL RECHAZAR EXPEDIENTE */}
      <Modal
        show={showRechazoModal}
        onHide={() => setShowRechazoModal(false)}
        centered
        >
        <Modal.Header closeButton>
            <Modal.Title>Rechazar Expediente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <div className="mb-3">
            <label className="form-label fw-bold">Justificación *</label>
            <textarea
                className="form-control"
                rows="3"
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                placeholder="Explique por qué se rechaza el expediente..."
            ></textarea>
            </div>
            <small className="text-muted">Este campo es obligatorio.</small>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRechazoModal(false)}>
            Cancelar
            </Button>

            <Button
            variant="danger"
            onClick={async () => {
                if (!justificacion.trim()) {
                showAlert("warning", "Justificación requerida", "Debe ingresar una justificación.");
                return;
                }

                await cambiarEstado(expedienteARechazar, "Rechazado", justificacion);
                setShowRechazoModal(false);
            }}
            >
            Confirmar Rechazo
            </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Expedientes;