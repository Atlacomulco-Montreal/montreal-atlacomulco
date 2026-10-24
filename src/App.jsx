
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import About from "./pages/About";
import Certifications from "./pages/Certifications";
import Enroll from "./pages/Enroll";
import Inscripciones from "./pages/Inscripciones";
import NotFound from "./pages/NotFound";

import PruebaConexion from "./PruebaConexion";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      {/* Prueba temporal de conexión con Django */}
      <PruebaConexion />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/certificaciones" element={<Certifications />} />
        <Route path="/quienes-somos" element={<About />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/inscripciones" element={<Inscripciones />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}
