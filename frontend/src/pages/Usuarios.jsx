import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/axiosInstance";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { showAlert } from "../utils/Alerts";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("crear");

  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState(1);
  const [password, setPassword] = useState("");

  const roles = [
    { label: "Técnico", value: 1 },
    { label: "Coordinador", value: 2 },
  ];

  // Cargar usuarios
  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/usuarios");
      const lista = Array.isArray(res.data?.data) ? res.data.data : [];
      setUsuarios(lista);
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "No se pudieron cargar los usuarios.");
    }
  };

  // Abrir modal para crear
  const abrirCrear = () => {
    setModo("crear");
    setId(null);
    setNombre("");
    setCorreo("");
    setRol(1);
    setPassword("");
    setShowModal(true);
  };

  // Abrir modal para editar
  const abrirEditar = (u) => {
    setModo("editar");
    setId(u.id_usuario);
    setNombre(u.nombre);
    setCorreo(u.correo);
    setRol(u.id_rol);
    setPassword("");
    setShowModal(true);
  };

  // Guardar (crear o editar)
    const guardarUsuario = async () => {
    if (!nombre.trim() || !correo.trim()) {
        return showAlert(
        "warning",
        "Datos incompletos",
        "Nombre y correo son obligatorios."
        );
    }

    // Validar contraseña solo en creación
    if (modo === "crear" && !password.trim()) {
        return showAlert(
        "warning",
        "Contraseña requerida",
        "Debe ingresar contraseña para crear usuario."
        );
    }

    try {
        const payload = {
        nombre,
        correo,
        id_rol: rol,
        };

        // Solo enviar contraseña si existe (creación o edición)
        if (password.trim()) {
        payload.contrasena = password;
        }

        if (modo === "crear") {
        // Crear nuevo usuario
        await api.post("/usuarios", payload);

        showAlert(
            "success",
            "Usuario creado",
            "El usuario fue agregado correctamente."
        );
        } else {
        // Editar usuario
        await api.put(`/usuarios/${id}`, payload);

        showAlert(
            "success",
            "Usuario actualizado",
            "Datos actualizados correctamente."
        );
        }

        // Cerrar modal y recargar lista
        setShowModal(false);
        cargarUsuarios();

    } catch (err) {
        console.error(err);
        const msg = err.response?.data?.message || "No se pudo guardar el usuario.";
        showAlert("error", "Error", msg);
    }
  };

  // Desactivar usuario
  const desactivarUsuario = async (id) => {
    if (!window.confirm("¿Está seguro que desea DESACTIVAR este usuario?")) return;

    try {
      await api.put(`/usuarios/${id}/desactivar`);
      showAlert("warning", "Usuario desactivado", "El usuario fue marcado como inactivo.");
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "No se pudo desactivar el usuario.");
    }
  };

  // Activar usuario
  const activarUsuario = async (id) => {
    try {
      await api.put(`/usuarios/${id}/activar`);
      showAlert("success", "Usuario activado", "El usuario fue activado correctamente.");
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      showAlert("error", "Error", "No se pudo activar el usuario.");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <Layout>
      <div className="container-fluid p-3">
        <h3 className="fw-bold mb-4">Administración de Usuarios</h3>

        <Button variant="success" onClick={abrirCrear} className="mb-3">
          + Nuevo Usuario
        </Button>

        {/* TABLA DE USUARIOS */}
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th style={{ width: "160px" }}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-3">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.id_rol === 1 ? "Técnico" : "Coordinador"}</td>
                  <td>
                    {u.activo ? (
                      <span className="badge bg-success">Activo</span>
                    ) : (
                      <span className="badge bg-secondary">Inactivo</span>
                    )}
                  </td>
                    <td>
                    <div className="d-flex align-items-center gap-2">

                        <Button
                        size="sm"
                        variant="primary"
                        onClick={() => abrirEditar(u)}
                        >
                        <i className="fe fe-edit"></i>
                        </Button>

                        {u.activo ? (
                        <Button
                            size="sm"
                            variant="warning"
                            onClick={() => desactivarUsuario(u.id_usuario)}
                        >
                            <i className="fe fe-lock"></i>
                        </Button>
                        ) : (
                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => activarUsuario(u.id_usuario)}
                        >
                            <i className="fe fe-unlock"></i>
                        </Button>
                        )}

                    </div>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* MODAL CREAR / EDITAR USUARIO */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modo === "crear" ? "Crear Usuario" : "Editar Usuario"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select value={rol} onChange={(e) => setRol(Number(e.target.value))}>
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Contraseña {modo === "editar" && "(opcional)"}
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder={
                    modo === "editar"
                      ? "Ingrese para cambiar contraseña"
                      : "Contraseña"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={guardarUsuario}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default Usuarios;