
import React, { useState } from "react";

// CAMBIA ESTA DIRECCIÓN POR LA URL REAL DE TU BACKEND EN RENDER
const API_URL = "https://montreal-backend-trh7.onrender.com/api/contacto/";

// Número de Montreal con código de país, sin + ni espacios
const WHATSAPP_NUMBER = "527225720866";

export default function ContactoFormulario() {
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSending(true);
    setError("");
    setSuccess("");
    setWhatsappLink("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const formData = {
      nombre: data.get("nombre")?.trim(),
      correo: data.get("correo")?.trim(),
      telefono: data.get("telefono")?.trim(),
      interes: data.get("interes"),
      dirigido_a: data.get("dirigido_a"),
      modalidad: data.get("modalidad"),
      horario: data.get("horario"),
      edad: data.get("edad")?.trim(),
      mensaje: data.get("mensaje")?.trim(),
    };

    if (
      !formData.nombre ||
      !formData.correo ||
      !formData.telefono ||
      !formData.interes ||
      !formData.modalidad ||
      !formData.horario ||
      !formData.mensaje
    ) {
      setError("Por favor completa todos los campos obligatorios.");
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "No fue posible enviar tu solicitud."
        );
      }

      // Mensaje preparado para WhatsApp
      const whatsappMessage = `
Nueva solicitud de información - Montreal Atlacomulco

Nombre: ${formData.nombre}
Correo: ${formData.correo}
Teléfono: ${formData.telefono}

Interés: ${formData.interes}
Dirigido a: ${formData.dirigido_a || "No especificado"}
Modalidad: ${formData.modalidad}
Horario: ${formData.horario}
Edad: ${formData.edad || "No especificada"}

Mensaje:
${formData.mensaje}
      `;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      setWhatsappLink(url);
      setSuccess(
        "¡Gracias! Tu solicitud fue enviada correctamente. Ya puedes compartirla por WhatsApp."
      );

      form.reset();

    } catch (err) {
      setError(
        err.message ||
        "Ocurrió un error. Intenta nuevamente más tarde."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="row justify-content-center"
      style={{ maxWidth: "750px", margin: "0 auto" }}
    >
      <div className="col-12 mb-3">
        <label className="form-label fw-bold">Nombre completo *</label>
        <input
          type="text"
          name="nombre"
          className="form-control"
          placeholder="Escribe tu nombre completo"
          autoComplete="name"
          maxLength="120"
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">Correo electrónico *</label>
        <input
          type="email"
          name="correo"
          className="form-control"
          placeholder="ejemplo@correo.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">Teléfono / WhatsApp *</label>
        <input
          type="tel"
          name="telefono"
          className="form-control"
          placeholder="10 dígitos"
          autoComplete="tel"
          maxLength="20"
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          ¿Qué información necesitas? *
        </label>
        <select name="interes" className="form-select" required defaultValue="">
          <option value="">Selecciona una opción</option>
          <option value="Cursos de inglés">Cursos de inglés</option>
          <option value="Cursos de computación">Cursos de computación</option>
          <option value="Regularización académica">Regularización académica</option>
          <option value="Certificaciones CONOCER">Certificaciones CONOCER</option>
          <option value="Certificaciones Cambridge">Certificaciones Cambridge</option>
          <option value="Talleres culturales">Talleres culturales</option>
          <option value="Otro servicio">Otro servicio</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          ¿Para quién es el servicio?
        </label>
        <select name="dirigido_a" className="form-select" defaultValue="">
          <option value="">Selecciona una opción</option>
          <option value="Para mí">Para mí</option>
          <option value="Para mi hijo o hija">Para mi hijo o hija</option>
          <option value="Para otra persona">Para otra persona</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">Modalidad *</label>
        <select name="modalidad" className="form-select" required defaultValue="">
          <option value="">Selecciona modalidad</option>
          <option value="Presencial">Presencial</option>
          <option value="En línea">En línea</option>
          <option value="Ambas">Me interesan ambas</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">Horario de preferencia *</label>
        <select name="horario" className="form-select" required defaultValue="">
          <option value="">Selecciona horario</option>
          <option value="Matutino">Matutino</option>
          <option value="Vespertino">Vespertino</option>
          <option value="Fines de semana">Fines de semana</option>
          <option value="Flexible">Flexible</option>
        </select>
      </div>

      <div className="col-12 mb-3">
        <label className="form-label fw-bold">
          Edad del interesado (opcional)
        </label>
        <input
          type="text"
          name="edad"
          className="form-control"
          placeholder="Ej. 15 años"
          maxLength="30"
        />
      </div>

      <div className="col-12 mb-3">
        <label className="form-label fw-bold">
          Cuéntanos qué información necesitas *
        </label>
        <textarea
          name="mensaje"
          className="form-control"
          rows="5"
          maxLength="3000"
          placeholder="Escribe tus dudas, objetivos o información que deseas conocer..."
          required
        />
      </div>

      <div className="col-12 text-center mt-3">
        <button
          type="submit"
          className="btn btn-danger btn-lg px-5"
          disabled={isSending}
        >
          {isSending ? "Enviando solicitud..." : "Enviar solicitud"}
        </button>
      </div>

      {error && (
        <div className="col-12 mt-3">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {success && (
        <div className="col-12 mt-3">
          <div className="alert alert-success">{success}</div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-lg w-100"
          >
            Enviar también por WhatsApp
          </a>
          <small className="text-muted d-block mt-2 text-center">
            Se abrirá WhatsApp con los datos preparados. Deberás presionar
            Enviar para compartirlos.
          </small>
        </div>
      )}
    </form>
  );
}
