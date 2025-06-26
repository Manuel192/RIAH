import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Create_session from './Create_session_component';
import '../css/Patients_list_component.css';
import '../App.css';

function Patients_list({redirect}) {
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(()=>{
    const init = async () => {
      const userID=await redirect();
      try{
        const responsePatients = await fetch(process.env.REACT_APP_GENERAL_URL+"/patient/loadPatients?user="+userID);
        if(!responsePatients.ok){
          return;
        }
        // convert data to json
        const patientsParsed = await responsePatients.json();
        setPatients(patientsParsed);
      }catch(error){}
    }
    init();
  }, [])
  
  // Filtrar patients por término de búsqueda
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (patient) => {
    setSelectedPatient((prev) => (prev? (prev.name === patient.name ? null : patient):patient));
  };

  const handleRawData = () => {
    navigate('/user/raw-data', { state: {patient:selectedPatient}})
  }

  const handleEvolution = () => {
    navigate('/user/evolution', { state: {patient:selectedPatient}});
  }

  const handleHomePanel = () => {
    navigate('/')
  }

  const handleAddPatient = () => {
    navigate('/user/create-patient')
  }

  return (
  <>
    <div className="sub-banner">
        <button className="nav-button" onClick={handleHomePanel}>Home</button> &gt; 
      Listado de pacientes
    </div>
    <div class="app">
    <h1 class="main-title">Listado de pacientes</h1>
      <div class={"patients-menu"}>
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
                {patient.name}
              </div>
            ))}
            {filteredPatients.length<1&&(
               <h3 class={"introduction-text"}>¡Bienvenid@! Ya puedes empezar a crear los perfiles de tus pacientes para realizar análisis de sus sesiones.</h3>
            )}
            </div>
          </div>
        {!selectedPatient?
        <div class={"rectangle"}>
          <button onClick={handleAddPatient}>
            <img style={{marginLeft:"25%", marginRight:"25%"}} src={require("../media/RIAH_Patient_Select.png")}></img>
          </button>
        </div>
        :
        (
        <div class={"rectangle"}>
          <div style={{display:"flex", justifyContent:"center"}}>
            <h3 class={"patient-name"}>{selectedPatient.name}</h3>
            <img style={{width:"50px", height:"70px"}} src={require("../media/RIAH_"+selectedPatient.gender+".png")}/>
            <label>{selectedPatient.birthdate.substring(8,10)+"/"+selectedPatient.birthdate.substring(5,7)+"/"+selectedPatient.birthdate.substring(0,4)+
                " ("+Math.floor(((new Date()).getTime () - (new Date(selectedPatient.birthdate.substring(0,10))).getTime()) / (365 * 24 * 60 * 60 * 1000))+
                " años)"}</label>
          </div>
          <button className="button-new-patient" onClick={handleEvolution}>
              Gestionar evolución
            </button>
            <button className="button-new-patient" style={{marginTop:"10px"}} onClick={handleRawData}>
              Gestionar sesiones
            </button>
          <Create_session patient={selectedPatient}></Create_session>
        </div>
        )}
      </div>
    </div>
    </>
  );
 }

export default Patients_list;