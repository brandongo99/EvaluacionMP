import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../utils/axiosInstance";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { showAlert } from "../utils/Alerts";
import { format } from "date-fns";

const ExpedienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rol = usuario?.id_rol; // 1 Técnico, 2 Coordinador

  const [expediente, setExpediente] = useState(null);
  const [indicios, setIndicios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Rechazo
  const [showRechazo, setShowRechazo] = useState(false);
  const [justificacion, setJustificacion] = useState("");

  // Modal Agregar Indicio
  const [showIndicio, setShowIndicio] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [color, setColor] = useState("");
  const [tamano, setTamano] = useState("");
  const [peso, setPeso] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  // CARGAR DETALLE DEL EXPEDIENTE
  const cargarExpediente = async () => {
    try {
        const res = await api.get("/expedientes");
        const lista = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
        const encontrado = lista.find((x) => Number(x.id_expediente) === Number(id));

        setExpediente(encontrado || null);
    } catch (err) {
        console.error(err);
        showAlert("error", "Error", "No se pudo cargar el expediente");
        navigate("/expedientes");
    }
  };

  // CARGAR INDICIOS
  const cargarIndicios = async () => {
    try {
        const res = await api.get(`/indicios/${id}`);
        const lista = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];

        setIndicios(lista);
    } catch (err) {
        console.error(err);
        showAlert("error", "Error", "No se pudieron cargar los indicios");
    }
  };

  useEffect(() => {
    const cargar = async () => {
      await cargarExpediente();
      await cargarIndicios();
      setLoading(false);
    };
    cargar();
  }, []);

  // CAMBIAR ESTADO (Enviar / Aprobar / Rechazar)
  const cambiarEstado = async (nuevo_estado) => {
    let body = { nuevo_estado };

    if (nuevo_estado === "Rechazado") {
      if (!justificacion.trim()) {
        showAlert("warning", "Justificación requerida", "Debe ingresar una justificación.");
        return;
      }
      body.justificacion = justificacion;
    }

    try {
      await api.put(`/expedientes/${id}/estado`, body);
      showAlert("success", "Éxito", `Expediente ${nuevo_estado}`);
      setShowRechazo(false);
      cargarExpediente();
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "No se pudo actualizar el estado");
    }
  };

  // AGREGAR INDICIO
  const guardarIndicio = async () => {
    if (!descripcion.trim()) {
      showAlert("warning", "Campo requerido", "La descripción es obligatoria.");
      return;
    }

    try {
      await api.post("/indicios", {
        descripcion,
        color,
        tamano,
        peso: peso ? Number(peso) : null,
        ubicacion,
        id_expediente: id
      });

      showAlert("success", "Éxito", "Indicio agregado.");
      setShowIndicio(false);

      // limpiar campos
      setDescripcion("");
      setColor("");
      setTamano("");
      setPeso("");
      setUbicacion("");

      cargarIndicios();
      cargarExpediente();
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "No se pudo agregar el indicio.");
    }
  };

  if (loading) return <Layout>Cargando...</Layout>;
  if (!expediente)
    return (
      <Layout>
        <h3>No se encontró el expediente.</h3>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-3 container-fluid">

        {/* ENCABEZADO */}
        <div className="border-bottom pb-3 mb-4 d-flex justify-content-between">
          <h3 className="fw-bold">
            Expediente #{expediente.numero_expediente}
          </h3>
          <Button variant="secondary" onClick={() => navigate("/expedientes")}>
            ← Regresar
          </Button>
        </div>

        {/* INFORMACIÓN GENERAL */}
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="mb-3">Información del Expediente</h4>
            <p><strong>Número:</strong> {expediente.numero_expediente}</p>
            <p><strong>Técnico:</strong> {expediente.tecnico}</p>
            <p><strong>Fecha registro:</strong> {format(new Date(expediente.fecha_registro), "dd/MM/yyyy")}</p>
            <p><strong>Estado:</strong> {expediente.estado}</p>

            {expediente.justificacion_rechazo && (
              <p><strong>Justificación rechazo:</strong> {expediente.justificacion_rechazo}</p>
            )}
          </div>
        </div>

        {/* INDICIOS */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Indicios</h4>

              {rol === 1 && expediente.estado === "Registrado" && (
                <Button variant="primary" onClick={() => setShowIndicio(true)}>
                  + Agregar Indicio
                </Button>
              )}
            </div>

            <Table responsive hover>
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
                {indicios.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No hay indicios registrados
                    </td>
                  </tr>
                ) : (
                  indicios.map((ind, index) => (
                    <tr key={ind.id_indicio}>
                      <td>{index + 1}</td>
                      <td>{ind.descripcion}</td>
                      <td>{ind.color}</td>
                      <td>{ind.tamano}</td>
                      <td>{ind.peso}</td>
                      <td>{ind.ubicacion}</td>
                      <td>{format(new Date(ind.fecha_registro), "dd/MM/yyyy HH:mm")}</td>
                      <td>{ind.tecnico}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {/* ACCIONES (ROL / ESTADO) */}
        <div className="card mb-4">
          <div className="card-body d-flex gap-2">

            {rol === 1 && expediente.estado === "Registrado" && expediente.cantidad_indicios > 0 && (
              <Button
                variant="warning"
                onClick={() => cambiarEstado("En revisión")}
              >
                Enviar a Revisión
              </Button>
            )}

            {rol === 2 && expediente.estado === "En revisión" && (
              <>
                <Button
                  variant="success"
                  onClick={() => cambiarEstado("Aprobado")}
                >
                  Aprobar
                </Button>

                <Button
                  variant="danger"
                  onClick={() => setShowRechazo(true)}
                >
                  Rechazar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL RECHAZO */}
      <Modal show={showRechazo} onHide={() => setShowRechazo(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rechazar Expediente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Justificación *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={justificacion}
              onChange={(e) => setJustificacion(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRechazo(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => cambiarEstado("Rechazado")}>
            Rechazar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL AGREGAR INDICIO */}
      <Modal show={showIndicio} onHide={() => setShowIndicio(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Indicio</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Control
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tamaño</Form.Label>
            <Form.Control
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Peso (gramos)</Form.Label>
            <Form.Control
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ubicación</Form.Label>
            <Form.Control
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIndicio(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={guardarIndicio}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default ExpedienteDetalle;