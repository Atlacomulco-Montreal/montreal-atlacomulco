
import { useEffect } from "react";

export default function PruebaConexion() {
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/cursos/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Conexión exitosa con Django:", data);
      })
      .catch((error) => {
        console.error("Error de conexión con Django:", error);
      });
  }, []);

  return (
    <div className="container mt-3">
      <p>Comprobando conexión con el servidor...</p>
    </div>
  );
}
