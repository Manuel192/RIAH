import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { height } from '@mui/system';

function Patients_list() {
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Lista de pacientes (solo incluye "Juan Pérez" como se indicó)
  const pacientes = ["Juan Pérez"];
  

  // Filtrar pacientes por término de búsqueda
  const filteredPatients = pacientes.filter((patient) =>
    patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient((prev) => (prev === patient ? null : patient));
  };

  const handleRawData = () => {
    navigate('/raw-data', { state: {user:"cb7c8009-b7c0-11ef-bbaf-e4e749429566"}})
  }

  const handleCreateSession = () => {
    navigate('/create-session', { state: {user:"cb7c8009-b7c0-11ef-bbaf-e4e749429566"}})
  }

  const handleEvolution = () => {
    navigate('/evolution');
  }

  return (
    <>
    <div className="sub-banner">
      <button className="nav-button">Home</button> &gt; 
      <button className="nav-button">Mi portal</button> &gt; 
      Listado de pacientes
    </div>
    <div div class="app">
    <h1>Listado de pacientes</h1>
    <hr className="linea-delimitadora" />
    <div className="listado-pacientes-container">
      {/* Margen izquierdo */}
      <div className="listado-pacientes-left">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
          <div className="list-container">
            <div className="scrollable-list">
            {filteredPatients.map((patient, index) => (
              <div
                key={index}
                onClick={() => handleSelectPatient(patient)}
                className={`list-item ${selectedPatient === patient ?"selected" : ""}`}>
                {patient}
              </div>
            ))}
          </div>
          </div>
        </div>

      {/* Margen derecho */}
      <div className="listado-pacientes-right">
        {selectedPatient ? (
          <>
            <h3>{selectedPatient}</h3>
            <button className="button-aniadir-sesion" onClick={handleCreateSession}>Añadir sesión</button>
            <button className="button-evolucion" onClick={handleEvolution}>Evolución</button>
            <button className="button-gestionar-datos" onClick={handleRawData}>Gestionar sesiones</button>
          </>
        ) : (
          <p style={{height:"150px", alignContent:"center"}}>Selecciona un paciente de la lista</p>
        )}
      </div>
    </div>
    </div>
    </>
  );
 }

export default Patients_list;