import React from "react";
import "../App.css"; // Importamos el CSS para estilos

const LoadingScreen = ({ isLoading }) => {
  if (!isLoading) return null; // Si no está cargando, no mostramos nada

  return (
    <>
    <div className="loading-overlay">
      <div className="spinner"></div>
      <div className="loading">Cargando...</div>
    </div>
    </>
  );
};

export default LoadingScreen;