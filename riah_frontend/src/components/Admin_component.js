import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { height } from '@mui/system';

function Admin() {    
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const [games, setGames] = useState(["Juego1", "Juego2", "Juego3"]);
  const [parameters, setParameters] = useState([]);

  // Lista de pacientes (solo incluye "Juan Pérez" como se indicó)
  const pacientes = ["Juan Pérez"];

  return (
  <>
    <div class="app">
    <h1>Panel de administración</h1>
    <hr className="linea-delimitadora" />
    Bienvenid@ al panel de administración. Este es un panel especial cuya función es gestionar los juegos y 
    <br/>
    operaciones disponibles para los terapeutas. Si un terapeuta necesita incorporar nuevas operaciones, aquí
    <br/>
    es donde se puede hacer. Este panel está en una versión temprana, por lo que se puede someter a cambios.
    <br/><br/>
    <button className="button-admin-game">Nuevo juego</button>
    {games.map((game, index) => (
    <>
    <h1>{game}</h1>
    <div className="admin-container">
      {/* Margen izquierdo */}
      <div className="admin-left">
          <div className="list-container">
          <h3>PARÁMETROS</h3>
            <div className="scrollable-list-admin">
            {parameters.map((patient, index) => (
              <div
                key={index}
                className={`list-item`}>
                {patient}
              </div>
            ))}
          </div>
          <button className="button-admin-add">+</button>
          </div>
        </div>

      {/* Margen derecho */}
      <div className="admin-right">
        <div className="list-container">
        <h3>CÁLCULOS</h3>
          <div className="scrollable-list">
            {parameters.map((patient, index) => (
              <div
                key={index}
                className={`list-item`}>
                {patient}
              </div>
            ))}
          </div>
        <button className="button-admin-add">+</button>
        </div>
      </div>
    </div>
    </>
    ))}
    </div>
    </>
  );
 }

export default Admin;