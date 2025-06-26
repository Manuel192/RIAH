import React from "react";
import '../css/loading_screen.css';
import "../App.css";

const LoadingScreen = ({ isLoading, text, isFixed }) => {
  if (!isLoading) return null; // Si no está cargando, no mostramos nada

  return (
    <>
    <div className="loading-overlay loading-graph" style={{position: isFixed?"fixed":"absolute"}}>
      <div className="spinner"></div>
      <div>{text}</div>
    </div>
    </>
  );
};

export default LoadingScreen;