import React from "react";
import '../css/LoadingScreen.css';
import "../App.css";

const LoadingScreen = ({ isLoading, text, isFixed }) => {
  if (!isLoading) return null;

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