import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Certifications() {
  const [certificaciones, setCertificaciones] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // ❗ CORRECCIÓN: tu API_URL ya incluía /api
  //const API_URL = "https://montreal-backend-production-def9.up.railway.app";
  const API_URL = "http://127.0.0.1:8000/";

  // Cargar certificaciones
  useEffect(() => {
    fetch(`${API_URL}/api/certificaciones/`)
      .then((res) => res.json())
      .then((data) => setCertificaciones(data))
      .catch((err) => console.error("Error al cargar certificaciones:", err));
  }, []);

  // Ir al formulario de inscripción
  const goToInscripcion = (e) => {
    e.preventDefault();

    if (location.pathname === "/enroll") {
      const form = document.getElementById("formulario");
      if (form) form.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/enroll#formulario");
    }
  };

  return (
    <div>

      {/* ===== ENCABEZADO ===== */}
      <section
        className="text-center text-white py-5"
        style={{ background: "linear-gradient(90deg, #1565C0, #7B1FA2)" }}
      >
        <h1 className="fw-bold mb-3">Certificaciones de Inglés</h1>
        <p className="lead">Consulta los certificados emitidos por Montreal.</p>
      </section>

      {/* ===== TABLA ===== */}
      <section className="py-5 bg-light">
        <div className="container">
          {certificaciones.length === 0 ? (
            <p className="text-center text-muted">
              Cargando certificaciones...
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle shadow-sm bg-white">
                <thead className="table-primary">
                  <tr>
                    <th>Alumno</th>
                    <th>Curso</th>
                    <th>Folio</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {certificaciones.map((c) => (
                    <tr key={c.id}>
                      <td>{c.alumno}</td>
                      <td>{c.curso_nombre || c.curso}</td>
                      <td>{c.folio}</td>
                      <td>{c.fecha_emision}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ===== LLAMADO A LA ACCIÓN ===== */}
      <section
        className="text-center text-white py-5"
        style={{ background: "linear-gradient(90deg, #388E3C, #D32F2F)" }}
      >
        <h2 className="fw-bold">¿Quieres tu certificación?</h2>
        <p>Inscríbete a nuestros cursos de preparación Cambridge.</p>

        <a
          href="/enroll#formulario"
          onClick={goToInscripcion}
          className="btn btn-light btn-lg fw-bold"
        >
          Ir a Inscripciones
        </a>
      </section>

    </div>
  );
}