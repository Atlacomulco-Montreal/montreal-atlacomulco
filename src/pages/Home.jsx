import React from "react";
import { Link } from "react-router-dom";
import certBanner from "../assets/certificaciones-banner.png";
import aboutImg from "../assets/about.png";
import ContactoFormulario from "../components/ContactoFormulario";
import BannerMontreal from "../components/BannerMontreal";



export default function Home() {
  // Scroll suave hacia el formulario de contacto
  const scrollToContacto = (e) => {
    e.preventDefault();
    const contactoSection = document.getElementById("contacto");
    if (contactoSection) {
      contactoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>

      {/* ====== NUEVO BANNER MONTREAL ====== */}
      <BannerMontreal />

      {/* ====== QUIÉNES SOMOS ====== */}
      <section id="quienes-somos" className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#1565C0" }}>
            Quiénes Somos
          </h2>

          <div className="row align-items-center">
            <div className="col-md-5 mb-3 mb-md-0">
              <img
                src={aboutImg}
                alt="Quiénes somos"
                className="img-fluid rounded shadow-sm"
              />
            </div>

            <div className="col-md-7">
              <p>
                <strong>Montreal: Idiomas, Tecnología y Cultura Atlacomulco</strong>{" "}
                ofrece formación integral en idiomas, tecnología y cultura para
                niños, jóvenes y adultos, fomentando el aprendizaje activo e
                innovador.
              </p>

              <Link to="/quienes-somos" className="btn btn-outline-primary mt-3">
                Leer más
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CURSOS ====== */}
      <section id="cursos" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#388E3C" }}>
            Oferta Académica
          </h2>

          <p className="text-center mb-4">
            Descubre nuestros programas formativos en idiomas, tecnología,
            cultura y más.
          </p>

          <div className="text-center mb-4">
            <Link
              to="/cursos"
              className="btn fw-bold btn-lg"
              style={{ backgroundColor: "#1565C0", color: "white" }}
            >
              Ver Cursos
            </Link>
          </div>

          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Área</th>
                <th>Descripción</th>
                <th>Duración</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Inglés</td>
                <td>Niveles desde Starters hasta C2, con preparación Cambridge.</td>
                <td>1 año por nivel</td>
              </tr>

              <tr>
                <td>Computación</td>
                <td>Ofimática, Programación, Desarrollo Web y Bases de Datos.</td>
                <td>1 año por nivel</td>
              </tr>

              <tr>
                <td>Regularización</td>
                <td>Apoyo académico en Matemáticas, Ciencias, Español e Historia.</td>
                <td>Variable según plan</td>
              </tr>

              <tr>
                <td>Cultura</td>
                <td>Talleres de Arte, Lectura y Expresión Cultural.</td>
                <td>16 semanas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ====== CERTIFICACIONES ====== */}
      <section id="certificaciones" className="py-5 bg-white text-center">
        <div className="container">
          <img
            src={certBanner}
            alt="Certificaciones Cambridge"
            className="img-fluid rounded mb-3"
          />

          <h2 style={{ color: "#7B1FA2" }}>Certificaciones Cambridge</h2>

          <p className="mb-4">
            Prepárate para los exámenes Cambridge English (Starters, Movers, Flyers,
            KET, PET, FCE, CAE).
          </p>

          <div className="ratio ratio-16x9 mb-4">
            <iframe
              src="https://www.youtube.com/embed/CIwqa_kElW4"
              title="Certificaciones Cambridge"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          <Link to="/certificaciones" className="btn btn-outline-dark fw-bold">
            Más información
          </Link>
        </div>
      </section>

      {/* ====== CONTACTO ====== */}
      <section id="contacto" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4" style={{ color: "#D32F2F" }}>
            Contáctanos
          </h2>

          <ContactoFormulario />
        </div>
      </section>

      {/* ====== AUDIO INSTITUCIONAL ====== */}
      <section className="py-5 bg-white text-center">
        <h2 className="mb-3" style={{ color: "#1565C0" }}>
          Escucha nuestro mensaje institucional
        </h2>
        <audio controls className="w-75">
        <source src="/montreal-audio.mp3" type="audio/mpeg" />
         Tu navegador no soporta el elemento de audio.
        </audio>


      </section>

    </div>
  );
}
