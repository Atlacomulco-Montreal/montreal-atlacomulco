import React, { useEffect, useMemo, useState } from "react";
import "./Inscripciones.css";

const FORM_INICIAL = {
  nombre: "",
  correo: "",
  telefono: "",
  edad: "",
  curso: "",
  nivel: "",
  fecha_inicio: "",
  nuevo_ingreso: true,
  comentarios: "",
};

export default function Inscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [editId, setEditId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(FORM_INICIAL);

  // Acepta VITE_API_URL con o sin "/" al final.
  const API_URL = (
    import.meta.env.VITE_API_URL ||
    "https://montreal-backend-trh7.onrender.com/api"
  ).replace(/\/+$/, "");

  const cargarInscripciones = async () => {
    setCargando(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/inscripciones/`);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      const data = await res.json();
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
          ? data.results
          : null;

      if (!lista) throw new Error("El formato de respuesta no es válido.");
      setInscripciones(lista);
    } catch (err) {
      console.error("Error al cargar inscripciones:", err);
      setError(
        "No se pudieron cargar las inscripciones. Verifica tu conexión con el servidor."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInscripciones();
    // La URL no cambia durante la vida del componente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eliminarInscripcion = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta inscripción?")) return;

    try {
      const res = await fetch(`${API_URL}/inscripciones/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      setInscripciones((actuales) => actuales.filter((item) => item.id !== id));
      if (editId === id) cancelarEdicion();
      alert("Inscripción eliminada correctamente.");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar la inscripción. Intenta nuevamente.");
    }
  };

  const iniciarEdicion = (item) => {
    setEditId(item.id);
    setFormData({
      nombre: item.nombre ?? "",
      correo: item.correo ?? "",
      telefono: item.telefono ?? "",
      edad: item.edad ?? "",
      curso: item.curso ?? "",
      nivel: item.nivel ?? "",
      fecha_inicio: item.fecha_inicio ?? "",
      nuevo_ingreso: item.nuevo_ingreso ?? true,
      comentarios: item.comentarios ?? "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setFormData(FORM_INICIAL);
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (editId === null) return;

    setGuardando(true);
    try {
      const res = await fetch(`${API_URL}/inscripciones/${editId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          edad: formData.edad === "" ? null : Number(formData.edad),
          nuevo_ingreso: Boolean(formData.nuevo_ingreso),
        }),
      });

      if (!res.ok) {
        const detalle = await res.text();
        throw new Error(detalle || `Error HTTP ${res.status}`);
      }

      alert("Cambios guardados correctamente.");
      cancelarEdicion();
      await cargarInscripciones();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("No se pudieron guardar los cambios. Verifica los datos e intenta nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const inscripcionesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return inscripciones;

    return inscripciones.filter((item) =>
      [item.nombre, item.correo, item.telefono, item.curso, item.nivel]
        .some((dato) => String(dato ?? "").toLowerCase().includes(termino))
    );
  }, [inscripciones, busqueda]);

  return (
    <main className="container-fluid container-inscripciones py-4 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="titulo-inscripciones mb-1">Gestión de inscripciones</h2>
          <p className="text-secondary mb-0">
            Consulta, edita y administra las inscripciones.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={cargarInscripciones}
          disabled={cargando}
        >
          {cargando ? "Actualizando..." : "↻ Actualizar"}
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card resumen-inscripciones h-100">
            <div className="card-body">
              <div className="text-secondary">Total de inscripciones</div>
              <div className="numero-inscripciones">{inscripciones.length}</div>
            </div>
          </div>
        </div>
      </div>

      <section className="card border-0 shadow-sm">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-12 col-md-8">
              <input
                type="search"
                className="form-control"
                placeholder="Buscar por nombre, correo, teléfono o curso..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar inscripciones"
              />
            </div>
            <div className="col-12 col-md-4 text-md-end">
              <span className="text-secondary">
                Resultados: {inscripcionesFiltradas.length}
              </span>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
              <button
                type="button"
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={cargarInscripciones}
                disabled={cargando}
              >
                Reintentar
              </button>
            </div>
          )}

          {cargando && inscripciones.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando inscripciones...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive tabla-contenedor">
                <table className="table table-striped table-hover align-middle tabla-inscripciones mb-0">
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
                    {inscripcionesFiltradas.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-semibold">{item.nombre || "—"}</td>
                        <td>{item.correo || "—"}</td>
                        <td>{item.telefono || "—"}</td>
                        <td>{item.edad ?? "—"}</td>
                        <td>{item.curso || "—"}</td>
                        <td>{item.nivel || "—"}</td>
                        <td>{item.fecha_inicio || "—"}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.nuevo_ingreso ? "text-bg-success" : "text-bg-secondary"
                            }`}
                          >
                            {item.nuevo_ingreso ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="comentarios-celda">
                          {item.comentarios || "—"}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-warning btn-sm"
                              onClick={() => iniciarEdicion(item)}
                              aria-label={`Editar ${item.nombre || "inscripción"}`}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => eliminarInscripcion(item.id)}
                              aria-label={`Eliminar ${item.nombre || "inscripción"}`}
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {inscripcionesFiltradas.length === 0 && (
                      <tr>
                        <td colSpan="10" className="text-center py-5">
                          {error ? "No hay datos disponibles." : "No se encontraron inscripciones."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-secondary small mt-3 mb-0">
                En pantallas pequeñas puedes deslizar la tabla horizontalmente para consultar todas las columnas.
              </p>
            </>
          )}
        </div>
      </section>

      {editId !== null && (
        <section className="card border-0 shadow-sm mt-4" id="formulario-edicion">
          <div className="card-header bg-primary text-white py-3">
            <h4 className="mb-0">Editar inscripción</h4>
          </div>

          <div className="card-body p-3 p-md-4">
            <form onSubmit={guardarEdicion}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="nombre" className="form-label fw-semibold">Nombre</label>
                  <input id="nombre" required name="nombre" className="form-control"
                    value={formData.nombre} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="correo" className="form-label fw-semibold">Correo</label>
                  <input id="correo" type="email" name="correo" className="form-control"
                    value={formData.correo} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="telefono" className="form-label fw-semibold">Teléfono</label>
                  <input id="telefono" name="telefono" type="tel" className="form-control"
                    value={formData.telefono} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="edad" className="form-label fw-semibold">Edad</label>
                  <input id="edad" type="number" min="0" name="edad" className="form-control"
                    value={formData.edad} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="curso" className="form-label fw-semibold">Curso</label>
                  <input id="curso" name="curso" className="form-control"
                    value={formData.curso} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="nivel" className="form-label fw-semibold">Nivel</label>
                  <input id="nivel" name="nivel" className="form-control"
                    value={formData.nivel} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="fecha_inicio" className="form-label fw-semibold">Fecha de inicio</label>
                  <input id="fecha_inicio" type="date" name="fecha_inicio" className="form-control"
                    value={formData.fecha_inicio} onChange={handleChange} />
                </div>

                <div className="col-12 col-md-6 d-flex align-items-center">
                  <div className="form-check mt-3">
                    <input id="nuevo_ingreso" type="checkbox" name="nuevo_ingreso"
                      className="form-check-input" checked={Boolean(formData.nuevo_ingreso)}
                      onChange={handleChange} />
                    <label className="form-check-label fw-semibold" htmlFor="nuevo_ingreso">
                      Alumno de nuevo ingreso
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="comentarios" className="form-label fw-semibold">Comentarios</label>
                  <textarea id="comentarios" name="comentarios" className="form-control"
                    rows="3" value={formData.comentarios} onChange={handleChange} />
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end mt-4">
                <button type="button" className="btn btn-outline-secondary"
                  onClick={cancelarEdicion} disabled={guardando}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success" disabled={guardando}>
                  {guardando ? "Guardando..." : "💾 Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}
