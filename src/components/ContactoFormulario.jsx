
import React, { useState } from "react";

const API_URL =
  "https://montreal-backend-trh7.onrender.com/api/contacto/";

// Sustituye las X por el número real de WhatsApp de Montreal.
const WHATSAPP_NUMBER = "52XXXXXXXXXX";

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

      // Valores que espera Django
      dirigido_a: data.get("dirigido_a"),
      modalidad: data.get("modalidad"),
      horario: data.get("horario"),

      // Django espera un número entero o null
      edad: data.get("edad")
        ? Number(data.get("edad"))
        : null,

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

    if (
      formData.edad !== null &&
      (!Number.isInteger(formData.edad) || formData.edad < 0)
    ) {
      setError("La edad debe ser un número entero.");
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

      const responseText = await response.text();

      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Respuesta inesperada del servidor. Código: ${response.status}`
        );
      }

      if (!response.ok) {
        const detalles = Object.entries(result)
          .map(([campo, mensajes]) => {
            const detalle = Array.isArray(mensajes)
              ? mensajes.join(", ")
              : typeof mensajes === "string"
              ? mensajes
              : JSON.stringify(mensajes);

            return `${campo}: ${detalle}`;
          })
          .join(" | ");

        throw new Error(
          detalles ||
          result.detail ||
          result.mensaje ||
          `Error del servidor: ${response.status}`
        );
      }

      const whatsappMessage = `
Nueva solicitud de información - Montreal Atlacomulco

Nombre: ${formData.nombre}
Correo: ${formData.correo}
Teléfono: ${formData.telefono}

Interés: ${formData.interes}
Dirigido a: ${formData.dirigido_a}
Modalidad: ${formData.modalidad}
Horario: ${formData.horario}
Edad: ${formData.edad ?? "No especificada"}

Mensaje:
${formData.mensaje}
      `;

      const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(whatsappMessage);

      setWhatsappLink(url);

      setSuccess(
        "¡Gracias! Tu solicitud se guardó correctamente."
      );

      form.reset();

    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      setError(
        err.message ||
        "No fue posible enviar tu solicitud."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="row justify-content-center"
      style={{
        maxWidth: "750px",
        margin: "0 auto",
      }}
    >
      <div className="col-12 mb-3">
        <label className="form-label fw-bold">
          Nombre completo *
        </label>
        <input
          type="text"
          name="nombre"
          className="form-control"
          placeholder="Escribe tu nombre completo"
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Correo electrónico *
        </label>
        <input
          type="email"
          name="correo"
          className="form-control"
          placeholder="ejemplo@correo.com"
          required
        />
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Teléfono / WhatsApp *
        </label>
        <input
          type="tel"
          name="telefono"
          className="form-control"
          placeholder="Número de teléfono"
          required
        />
      </div>

      <div className="col-12 mb-3">
        <label className="form-label fw-bold">
          ¿Qué información necesitas? *
        </label>
        <select
          name="interes"
          className="form-select"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          <option value="Cursos de inglés">
            Cursos de inglés
          </option>
          <option value="Cursos de computación">
            Cursos de computación
          </option>
          <option value="Regularización académica">
            Regularización académica
          </option>
          <option value="Certificaciones CONOCER">
            Certificaciones CONOCER
          </option>
          <option value="Certificaciones Cambridge">
            Certificaciones Cambridge
          </option>
          <option value="Talleres culturales">
            Talleres culturales
          </option>
          <option value="Otro servicio">
            Otro servicio
          </option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          ¿Para quién es el servicio?
        </label>
        <select
          name="dirigido_a"
          className="form-select"
          defaultValue="yo"
        >
          <option value="yo">Para mí</option>
          <option value="hijo">Para mi hijo o hija</option>
          <option value="otro">Para otra persona</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Modalidad *
        </label>
        <select
          name="modalidad"
          className="form-select"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          <option value="presencial">Presencial</option>
          <option value="online">En línea</option>
          <option value="ambas">Ambas</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Horario de preferencia *
        </label>
        <select
          name="horario"
          className="form-select"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          <option value="matutino">Matutino</option>
          <option value="vespertino">Vespertino</option>
          <option value="fines_semana">Fines de semana</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>

      <div className="col-md-6 mb-3">
        <label className="form-label fw-bold">
          Edad del interesado (opcional)
        </label>
        <input
          type="number"
          name="edad"
          className="form-control"
          placeholder="Ej. 15"
          min="0"
          step="1"
        />
      </div>

      <div className="col-12 mb-3">
        <label className="form-label fw-bold">
          Cuéntanos qué información necesitas *
        </label>
        <textarea
          name="mensaje"
          className="form-control"
          rows="4"
          placeholder="Escribe tu mensaje o consulta..."
          required
        ></textarea>
      </div>

      {error && (
        <div className="col-12 mb-3">
          <div className="alert alert-danger">
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="col-12 mb-3">
          <div className="alert alert-success">
            {success}
          </div>
        </div>
      )}

      {whatsappLink && (
        <div className="col-12 mb-3 text-center">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            Compartir solicitud por WhatsApp
          </a>
        </div>
      )}

      <div className="col-12 text-center mt-2">
        <button
          type="submit"
          className="btn btn-danger px-5 py-3"
          disabled={isSending}
        >
          {isSending
            ? "Enviando solicitud..."
            : "Enviar solicitud"}
        </button>
      </div>

      <div className="col-12 mt-3 text-center">
        <small className="text-muted">
          * Campos obligatorios
        </small>
      </div>
    </form>
  );
}
