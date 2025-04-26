import React from "react";
import '../css/loading_screen.css';
import "../App.css";

const LoadingScreen = ({ isLoading }) => {
  if (!isLoading) return null; // Si no está cargando, no mostramos nada

  return (
    <>
    <div className="loading-overlay loading-graph">
      <div className="spinner"></div>
      <div>Cargando...</div>
    </div>
    </>
  );
};

export default LoadingScreen;