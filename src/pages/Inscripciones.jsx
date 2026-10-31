
import React, { useEffect, useState } from "react";
import "./Inscripciones.css";

export default function Inscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // ===== CONFIGURACIÓN DE API =====
  const API_URL = (
    import.meta.env.VITE_API_URL ||
    "https://montreal-backend-trh7.onrender.com/api"
  ).replace(/\/$/, "");

  // ===== CARGAR INSCRIPCIONES =====
  const cargarInscripciones = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await fetch(`${API_URL}/inscripciones/`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las inscripciones.");
      }

      const data = await respuesta.json();

      setInscripciones(
        Array.isArray(data) ? data : data.results || []
      );

    } catch (err) {
      console.error("Error al cargar inscripciones:", err);
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInscripciones();
  }, []);

  // ===== BUSCAR INSCRIPCIONES =====
  const inscripcionesFiltradas = inscripciones.filter((i) =>
    [
      i.nombre,
      i.correo,
      i.telefono,
      i.curso,
      i.nivel,
      i.comentarios,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // ===== EDITAR INSCRIPCIÓN =====
  const iniciarEdicion = (inscripcion) => {
    setEditando({
      ...inscripcion,
      nuevo_ingreso: Boolean(inscripcion.nuevo_ingreso),
    });

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  // ===== GUARDAR CAMBIOS =====
  const guardarCambios = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);

      const respuesta = await fetch(
        `${API_URL}/inscripciones/${editando.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editando),
        }
      );

      if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(
          detalle || "No se pudieron guardar los cambios."
        );
      }

      alert("Inscripción actualizada correctamente.");
      setEditando(null);
      await cargarInscripciones();

    } catch (err) {
      console.error("Error al actualizar:", err);
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  };

  // ===== ELIMINAR INSCRIPCIÓN =====
  const eliminarInscripcion = async (id) => {
    if (
      !window.confirm(
        "¿Deseas eliminar esta inscripción?"
      )
    ) {
      return;
    }

    try {
      const respuesta = await fetch(
        `${API_URL}/inscripciones/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar la inscripción.");
      }

      alert("Inscripción eliminada correctamente.");

      if (editando?.id === id) {
        setEditando(null);
      }

      await cargarInscripciones();

    } catch (err) {
      console.error("Error al eliminar:", err);
      alert(err.message);
    }
  };

  // ===== ACTUALIZAR CAMPOS =====
  const actualizarCampo = (campo, valor) => {
    setEditando((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  return (
    <div className="container-inscripciones">

      {/* ===== ENCABEZADO ORIGINAL ===== */}
      <section
        className="text-center text-white py-5"
        style={{
          background: "linear-gradient(90deg, #1565C0, #7B1FA2)",
        }}
      >
        <div className="container">
          <h1 className="fw-bold mb-3">
            Inscripciones Montreal
          </h1>

          <p className="lead">
            Consulta y administra las inscripciones de nuestros alumnos.
          </p>
        </div>
      </section>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <section className="py-5">
        <div className="container">

          {/* ===== RESUMEN ===== */}
          <div className="card resumen-inscripciones mb-4">
            <div className="card-body">
              <span className="resumen-etiqueta">
                Total de alumnos inscritos
              </span>

              <div className="numero-inscripciones">
                {inscripciones.length}
              </div>

              <div className="resumen-pie">
                Registros registrados en el sistema Montreal
              </div>
            </div>
          </div>

          {/* ===== TARJETA DE INSCRIPCIONES ===== */}
          <div className="card tarjeta-inscripciones mb-4">
            <div className="card-body p-3 p-md-4">

              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                <div>
                  <span className="etiqueta-seccion">
                    ADMINISTRACIÓN
                  </span>

                  <h4 className="titulo-inscripciones mb-1">
                    Alumnos inscritos
                  </h4>

                  <span className="texto-resultados">
                    Mostrando {inscripcionesFiltradas.length} de{" "}
                    {inscripciones.length} registros.
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-outline-primary boton-actualizar"
                  onClick={cargarInscripciones}
                  disabled={cargando}
                >
                  {cargando
                    ? "Actualizando..."
                    : "↻ Actualizar lista"}
                </button>

              </div>

              {/* ===== BUSCADOR ===== */}
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control campo-busqueda"
                  placeholder="Buscar por nombre, correo, teléfono o curso..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>

              {/* ===== CARGANDO ===== */}
              {cargando ? (

                <div className="text-center py-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  >
                    <span className="visually-hidden">
                      Cargando...
                    </span>
                  </div>

                  <p className="text-muted mt-3">
                    Cargando inscripciones...
                  </p>
                </div>

              ) : error ? (

                /* ===== ERROR ===== */
                <div className="alert alert-danger text-center">
                  {error}

                  <button
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={cargarInscripciones}
                  >
                    Reintentar
                  </button>
                </div>

              ) : inscripcionesFiltradas.length === 0 ? (

                /* ===== SIN RESULTADOS ===== */
                <div className="text-center py-5">
                  <h5 className="texto-vacio">
                    No se encontraron inscripciones.
                  </h5>

                  <p className="text-muted">
                    Verifica la búsqueda o intenta actualizar la lista.
                  </p>
                </div>

              ) : (

                /* ===== TABLA ===== */
                <div className="tabla-contenedor table-responsive">

                  <table className="table table-hover text-center align-middle mb-0 tabla-inscripciones">

                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Edad</th>
                        <th>Curso</th>
                        <th>Nivel</th>
                        <th>Fecha de inicio</th>
                        <th>Nuevo ingreso</th>
                        <th>Comentarios</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {inscripcionesFiltradas.map((i) => (
                        <tr key={i.id}>

                          <td>{i.nombre || "—"}</td>
                          <td>{i.correo || "—"}</td>
                          <td>{i.telefono || "—"}</td>
                          <td>{i.edad || "—"}</td>
                          <td>{i.curso || "—"}</td>
                          <td>{i.nivel || "—"}</td>
                          <td>{i.fecha_inicio || "—"}</td>

                          <td>
                            {i.nuevo_ingreso ? (
                              <span className="badge bg-success">
                                Sí
                              </span>
                            ) : (
                              <span className="badge bg-secondary">
                                No
                              </span>
                            )}
                          </td>

                          <td className="comentarios-celda">
                            {i.comentarios || (
                              <span className="texto-vacio">
                                Sin comentarios
                              </span>
                            )}
                          </td>

                          <td>
                            <div className="d-flex justify-content-center gap-2">

                              <button
                                type="button"
                                className="btn btn-sm btn-warning"
                                onClick={() => iniciarEdicion(i)}
                              >
                                ✏️Editar
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => eliminarInscripcion(i.id)}
                              >
                                🗑️Eliminar
                              </button>

                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}

            </div>
          </div>

          {/* ===== FORMULARIO DE EDICIÓN ===== */}
          {editando && (

            <div className="card tarjeta-edicion mb-4">

              <div className="card-header encabezado-edicion">
                <span className="etiqueta-seccion">
                  ACTUALIZACIÓN DE DATOS
                </span>

                <h4 className="mb-0">
                  Editar inscripción
                </h4>
              </div>

              <div className="card-body p-3 p-md-4">

                <form onSubmit={guardarCambios}>

                  <div className="row g-3">

                    {[
                      ["nombre", "Nombre completo", "text"],
                      ["correo", "Correo electrónico", "email"],
                      ["telefono", "Teléfono", "text"],
                      ["edad", "Edad", "number"],
                      ["curso", "Curso", "text"],
                      ["nivel", "Nivel", "text"],
                      ["fecha_inicio", "Fecha de inicio", "date"],
                    ].map(([campo, etiqueta, tipo]) => (

                      <div className="col-md-6" key={campo}>
                        <label className="form-label">
                          {etiqueta}
                        </label>

                        <input
                          type={tipo}
                          className="form-control"
                          value={editando[campo] ?? ""}
                          onChange={(e) =>
                            actualizarCampo(campo, e.target.value)
                          }
                        />
                      </div>

                    ))}

                    {/* ===== NUEVO INGRESO ===== */}
                    <div className="col-12">
                      <div className="form-check mt-2">

                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="nuevoIngreso"
                          checked={Boolean(editando.nuevo_ingreso)}
                          onChange={(e) =>
                            actualizarCampo(
                              "nuevo_ingreso",
                              e.target.checked
                            )
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="nuevoIngreso"
                        >
                          Nuevo ingreso
                        </label>

                      </div>
                    </div>

                    {/* ===== COMENTARIOS ===== */}
                    <div className="col-12">
                      <label className="form-label">
                        Comentarios
                      </label>

                      <textarea
                        className="form-control"
                        rows="4"
                        value={editando.comentarios ?? ""}
                        onChange={(e) =>
                          actualizarCampo(
                            "comentarios",
                            e.target.value
                          )
                        }
                      />
                    </div>

                  </div>

                  {/* ===== BOTONES ===== */}
                  <div className="mt-4 d-flex flex-wrap gap-2">

                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={guardando}
                    >
                      {guardando
                        ? "Guardando..."
                        : "💾 Guardar cambios"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setEditando(null)}
                      disabled={guardando}
                    >
                      Cancelar
                    </button>

                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ===== PIE DE PÁGINA ORIGINAL CONSERVADO ===== */}
      <section
        className="text-center text-white py-5"
        style={{
          background: "linear-gradient(90deg, #388E3C, #D32F2F)",
        }}
      >
        <div className="container">
          <h2 className="fw-bold">
            Montreal: Formación para el futuro
          </h2>

          <p className="lead">
            Gracias por confiar en nosotros para tu preparación académica
            y profesional.
          </p>
        </div>
      </section>

    </div>
  );
}
