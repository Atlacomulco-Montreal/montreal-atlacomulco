
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Enroll() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL del backend
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://montreal-backend-trh7.onrender.com/api";

  // Cursos y niveles disponibles
  const courseLevels = {
    Inglés: ["Starters", "Movers", "Flyers", "A2", "B1", "B2", "C1", "C2"],
    Computación: ["Básico", "Intermedio", "Avanzado", "Programador"],
    Regularización: [
      "Matemáticas",
      "Español",
      "Ciencias",
      "Historia",
      "Geografía",
    ],
    Cultura: [
      "Taller de Arte",
      "Taller de Lectura",
      "Taller de Expresión",
    ],
  };

  // Cambio de curso
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedLevel("");
  };

  // Validación de correo electrónico
  const validarCorreo = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  // Enviar inscripción
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const datos = Object.fromEntries(formData.entries());

    // Convertir checkbox a booleano
    datos.nuevo_ingreso = formData.get("nuevo_ingreso") ? true : false;

    // Validar correo
    if (!validarCorreo(datos.correo)) {
      alert(
        "⚠️ El correo no es válido. Usa un formato como: correo@gmail.com"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/inscripciones/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

        alert(
          "⚠️ Error al registrar la inscripción. Verifica los campos."
        );
      }
    } catch (error) {
      console.error("⚠️ Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-light">

      {/* ENCABEZADO */}
      <section
        className="text-center py-5 text-white"
        style={{
          background: "linear-gradient(90deg, #1565C0, #7B1FA2)",
        }}
      >
        <div className="container">
          <h1 className="fw-bold">
            Formulario de Inscripción
          </h1>

          <p className="lead">
            Completa tus datos y forma parte de la comunidad Montreal.
          </p>
        </div>
      </section>

      {/* FORMULARIO DE INSCRIPCIÓN */}
      <section id="formulario" className="py-5">
        <div className="container">

          <form
            onSubmit={handleSubmit}
            className="row justify-content-center"
          >
            <div className="col-md-8 col-lg-6 p-4 bg-white rounded shadow-sm">

              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Nombre completo
                </label>

                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  required
                />
              </div>

              {/* Correo */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  name="correo"
                  className="form-control"
                  required
                />
              </div>

              {/* Teléfono */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Teléfono
                </label>

                <input
                  type="text"
                  name="telefono"
                  className="form-control"
                  required
                />
              </div>

              {/* Edad */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Edad
                </label>

                <input
                  type="number"
                  name="edad"
                  min="3"
                  max="99"
                  className="form-control"
                  required
                />
              </div>

              {/* Fecha de inicio */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Fecha de inicio
                </label>

                <input
                  type="date"
                  name="fecha_inicio"
                  className="form-control"
                  required
                />
              </div>

              {/* Nuevo ingreso */}
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  name="nuevo_ingreso"
                  className="form-check-input"
                  defaultChecked
                />

                <label className="form-check-label fw-bold ms-2">
                  Alumno de nuevo ingreso
                </label>
              </div>

              {/* Curso */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Curso
                </label>

                <select
                  className="form-select"
                  name="curso"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  required
                >
                  <option value="">
                    Selecciona un curso
                  </option>

                  {Object.keys(courseLevels).map((curso) => (
                    <option key={curso} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nivel */}
              {selectedCourse && (
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Nivel / Subcategoría
                  </label>

                  <select
                    className="form-select"
                    name="nivel"
                    value={selectedLevel}
                    onChange={(e) =>
                      setSelectedLevel(e.target.value)
                    }
                    required
                  >
                    <option value="">
                      Selecciona una opción
                    </option>

                    {courseLevels[selectedCourse].map(
                      (level, index) => (
                        <option key={index} value={level}>
                          {level}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* Comentarios */}
              <div className="mt-3">
                <label className="form-label fw-bold">
                  Comentarios adicionales
                </label>

                <textarea
                  name="comentarios"
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>

              {/* Botón enviar */}
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="btn btn-danger btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Enviando..."
                    : "Enviar inscripción"}
                </button>
              </div>

            </div>
          </form>

        </div>
      </section>

      {/* SECCIÓN FINAL: CONSULTA DE INSCRIPCIONES */}
      <section
        className="text-center text-white py-5"
        style={{
          background: "linear-gradient(90deg, #388E3C, #D32F2F)",
        }}
      >
        <div className="container">
          <h2 className="fw-bold mb-3">
            ¡Montreal: Formación para el futuro!
          </h2>

          <p className="lead mb-4">
            Consulta y administra las inscripciones de nuestros alumnos.
            En Montreal seguimos trabajando para impulsar tu formación
            académica y profesional.
          </p>

          <Link
            to="/inscripciones"
            className="btn btn-light btn-lg fw-bold px-4"
          >
            🔍 Ver inscripciones registradas
          </Link>
        </div>
      </section>

    </div>
  );
}
