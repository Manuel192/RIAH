import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const handleCreateSession = () => {
    navigate('/user/create-session', { state: {patient:selectedPatient}})
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
      <div class={selectedPatient?"patients-menu-selected":"patients-menu"}>
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
               <h3 class={"introduction-text"}>¡Buenas! Ya puedes empezar a crear los perfiles de tus pacientes para realizar análisis de sus sesiones.</h3>
            )}
            </div>
            <button className="button-new-patient" onClick={handleAddPatient}>
                +
            </button>
          </div>
        {selectedPatient && (
        <div class={"rectangle"}>
          <h3 class={"patient-name title"}>{selectedPatient.name}</h3>
            <>
            <div style={{textAlign: "center", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", justifyItems: "center",  marginBottom:"40px"}}>
              <h3 class="title">Sexo</h3>
              <h3 class="title">Fecha de nacimiento</h3>
              <img style={{width:"100px"}} src={require("../media/RIAH_"+selectedPatient.gender+".png")}/>
              <label>{selectedPatient.birthdate.substring(8,10)+"/"+selectedPatient.birthdate.substring(5,7)+"/"+selectedPatient.birthdate.substring(0,4)+
              " ("+Math.floor(((new Date()).getTime () - (new Date(selectedPatient.birthdate.substring(0,10))).getTime()) / (365 * 24 * 60 * 60 * 1000))+
              " años)"}</label>
            </div>
            <hr></hr>
            <div style={{textAlign: "center", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyItems: "center", marginTop:"40px"}}>
              <button class="button-patient-option" onClick={handleCreateSession}>
              <img src={require("../media/RIAH_"+(selectedPatient.gender==="Masculino"?"M":"W")+"_SessionCreation.png")}></img>
              </button>
              <button class="button-patient-option" onClick={handleEvolution}>
                <img src={require("../media/RIAH_"+(selectedPatient.gender==="Masculino"?"M":"W")+"_Evolution.png")}></img>
              </button>
              <button class="button-patient-option" onClick={handleRawData}>
              <img src={require("../media/RIAH_"+(selectedPatient.gender==="Masculino"?"M":"W")+"_SessionManagement.png")}></img>
              </button>
            </div>
            </>
        </div>
        )}
      </div>
    </div>
    </>
  );
 }

export default Patients_list;