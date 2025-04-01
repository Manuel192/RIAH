import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Patients_list_component.css';
import '../App.css';
import { Rectangle } from 'recharts';

function Patients_list() {
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const pacientes = ["John Doe", "Paciente 1", "Paciente 2", "Paciente 3", "Paciente 4"];
  

  // Filtrar pacientes por término de búsqueda
  const filteredPatients = pacientes.filter((patient) =>
    patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient((prev) => (prev === patient ? null : patient));
  };

  const handleRawData = () => {
    navigate('/user/raw-data', { state: {user:"cb7c8009-b7c0-11ef-bbaf-e4e749429566"}})
  }

  const handleCreateSession = () => {
    navigate('/user/create-session', { state: {user:"cb7c8009-b7c0-11ef-bbaf-e4e749429566"}})
  }

  const handleEvolution = () => {
    navigate('/user/evolution');
  }
  const handlePatientList = () => {
    navigate('/user/patients-list')
  }

  const handleUserPanel = () => {
  navigate('/user')
  }

  return (
  <>
    <div className="sub-banner">
        <button className="nav-button">Home</button> &gt; 
        <button className="nav-button" onClick={handleUserPanel}>Mi panel</button> &gt; 
      Listado de pacientes
    </div>
    <div class="app">
    <h1 class="main-title">Listado de pacientes</h1>
      <div class="patients-menu">
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
        <div class={selectedPatient?"rectangle":"rectangle unselected"}>
          <h3 class={selectedPatient?"patient-name title":"patient-name unselected title"}>{selectedPatient || "Selecciona un paciente"}</h3>
          {selectedPatient && (
            <>
            <div style={{textAlign: "center", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", justifyItems: "center",  marginBottom:"40px"}}>
              <h3 class="title">Sexo</h3>
              <h3 class="title">Fecha de nacimiento</h3>
              <img style={{width:"100px"}} src={require("../media/RIAH_Man.png")}/>
              <label>{"17/08/2003 (21 años)"}</label>
            </div>
            <hr></hr>
            <div style={{textAlign: "center", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyItems: "center", marginTop:"40px"}}>
              <button class="button-patient-option" onClick={handleCreateSession}>
              <img src={require("../media/RIAH_User_SessionCreation.png")}></img>
              </button>
              <button class="button-patient-option" onClick={handleEvolution}>
                <img src={require("../media/RIAH_User_Evolution.png")}></img>
              </button>
              <button class="button-patient-option" onClick={handleRawData}>
              <img src={require("../media/RIAH_User_SessionManagement.png")}></img>
              </button>
            </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
 }

export default Patients_list;