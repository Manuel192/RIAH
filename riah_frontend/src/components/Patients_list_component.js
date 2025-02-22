import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Patients_list_component.css';
import '../App.css';

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
  const handlePatientList = () => {
    navigate('/patients-list')
  }

  const handleUserPanel = () => {
  navigate('/')
  }

  return (
  <>
    <div className="sub-banner">
        <button className="nav-button">Home</button> &gt; 
        <button className="nav-button" onClick={handleUserPanel}>Mi panel</button> &gt; 
      Listado de pacientes
    </div>
    <div class="app">
      <div>
      <h1 class="main-title">Listado de pacientes</h1>
        <div className="list-container">
          <div className="scrollable-list-patients">
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
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

        {selectedPatient ? (
          <div class="patient-info rectangle">
            <h3>{selectedPatient}</h3>
            <button class="button-create-session-access" onClick={handleCreateSession}>Añadir sesión</button>
            <button class="button-evolution" onClick={handleEvolution}>Evolución</button>
            <button class="button-raw-data" onClick={handleRawData}>Gestionar sesiones</button>
          </div>
          ) : (
            ""
          )}
      </div>
    </>
  );
 }

export default Patients_list;