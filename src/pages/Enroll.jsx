import React, { useState } from "react";
import { Link } from "react-router-dom";
import certBanner from "../assets/certificaciones-banner.png";

export default function Enroll() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 URL correcta del backend
  //const API_URL = "https://montreal-backend-production-def9.up.railway.app/api";
  const API_URL = "http://127.0.0.1:8000/api";

  const courseLevels = {
    Inglés: ["Starters", "Movers", "Flyers", "A2", "B1", "B2", "C1", "C2"],
    Computación: ["Básico", "Intermedio", "Avanzado", "Programador"],
    Regularización: ["Matemáticas", "Español", "Ciencias", "Historia", "Geografía"],
    Cultura: ["Taller de Arte", "Taller de Lectura", "Taller de Expresión"],
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedLevel("");
  };

  // 🔥 VALIDACIÓN DE CORREO
  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const datos = Object.fromEntries(formData.entries());

    // Convertir checkbox
    datos.nuevo_ingreso = formData.get("nuevo_ingreso") ? true : false;

    // ✔️ Validación ANTES de enviar al backend
    if (!validarCorreo(datos.correo)) {
      alert("⚠️ El correo no es válido. Usa un formato como: correo@gmail.com");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/inscripciones/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        alert("✅ Inscripción registrada correctamente.");
        event.target.reset();
        setSelectedCourse("");
        setSelectedLevel("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Error exacto del backend:", errorData);
        alert("⚠️ Error al registrar la inscripción. Verifica los campos.");
      }
    } catch (error) {
      console.error("⚠️ Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-light">

      <section className="text-center py-5 text-white" style={{ backgroundColor: "#D32F2F" }}>
        <h1 className="fw-bold">Formulario de Inscripción</h1>
        <p>Completa tus datos y forma parte de la comunidad Montreal.</p>
      </section>

      <section id="formulario" className="py-5">
        <div className="container">
          <form onSubmit={handleSubmit} className="row justify-content-center">
            <div className="col-md-8 col-lg-6 p-4 bg-white rounded shadow-sm">

              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre completo</label>
                <input type="text" name="nombre" className="form-control" required />
              </div>

              {/* Correo */}
              <div className="mb-3">
                <label className="form-label fw-bold">Correo electrónico</label>
                <input type="email" name="correo" className="form-control" required />
              </div>

              {/* Teléfono */}
              <div className="mb-3">
                <label className="form-label fw-bold">Teléfono</label>
                <input type="text" name="telefono" className="form-control" required />
              </div>

              {/* Edad */}
              <div className="mb-3">
                <label className="form-label fw-bold">Edad</label>
                <input type="number" name="edad" min="3" max="99" className="form-control" required />
              </div>

              {/* Fecha de inicio */}
              <div className="mb-3">
                <label className="form-label fw-bold">Fecha de inicio</label>
                <input type="date" name="fecha_inicio" className="form-control" required />
              </div>

              {/* Nuevo ingreso */}
              <div className="form-check mb-3">
                <input type="checkbox" name="nuevo_ingreso" className="form-check-input" defaultChecked />
                <label className="form-check-label fw-bold ms-2">Alumno de nuevo ingreso</label>
              </div>

              {/* Curso */}
              <div className="mb-3">
                <label className="form-label fw-bold">Curso</label>
                <select className="form-select" name="curso" value={selectedCourse} onChange={handleCourseChange} required>
                  <option value="">Selecciona un curso</option>
                  {Object.keys(courseLevels).map((curso) => (
                    <option key={curso} value={curso}>{curso}</option>
                  ))}
                </select>
              </div>

              {/* Nivel */}
              {selectedCourse && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Nivel / Subcategoría</label>
                  <select
                    className="form-select"
                    name="nivel"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    {courseLevels[selectedCourse].map((level, index) => (
                      <option key={index} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Comentarios */}
              <div className="mt-3">
                <label className="form-label fw-bold">Comentarios adicionales</label>
                <textarea name="comentarios" className="form-control" rows="3"></textarea>
              </div>

              {/* Enviar */}
              <div className="text-center mt-4">
                <button type="submit" className="btn btn-danger btn-lg" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar inscripción"}
                </button>
              </div>

            </div>
          </form>

          {/* Ver inscripciones */}
          <div className="text-center mt-5">
            <Link to="/inscripciones" className="btn fw-bold px-4 py-2 text-white" style={{ backgroundColor: "#343a40" }}>
              🔍 Ver inscripciones registradas
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
