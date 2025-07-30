import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Create_session from './CreateSessionComponent';
import '../css/PatientsListComponent.css';
import '../App.css';

function Patients_list({redirect}) {
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const location = useLocation();
  const [userID, setUserID] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermUnaccessible, setSearchTermUnaccessible] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [accessiblePatients, setaccessiblePatients] = useState([]);
  const [requestedPatients, setRequestedPatients] = useState([]);
  const [unaccessiblePatients, setUnacessiblePatients] = useState([]);

  useEffect(()=>{
    const init = async () => {
      const newUserID=await redirect()
      setUserID(newUserID);

      var newUnaccessiblePatients=[];
      const responseHospitalPatients = await fetch(process.env.REACT_APP_GENERAL_URL+"/patient/loadHospitalPatients?user="+newUserID,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
      if(responseHospitalPatients.ok){
        newUnaccessiblePatients=await responseHospitalPatients.json();
      }else return;

       const responseaccessiblePatients = await fetch(process.env.REACT_APP_GENERAL_URL+"/patient/loadAccessiblePatients?user="+newUserID,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
      if(responseaccessiblePatients.ok){
        const accessiblePatientsParsed = await responseaccessiblePatients.json();
        setaccessiblePatients(accessiblePatientsParsed);
        newUnaccessiblePatients=newUnaccessiblePatients-accessiblePatientsParsed;
      }

      const responseRequestedPatients = await fetch(process.env.REACT_APP_GENERAL_URL+"/patient/loadRequestedPatients?user="+newUserID,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
      if(responseRequestedPatients.ok){
        const requestedPatientsParsed = await responseRequestedPatients.json();
        setRequestedPatients(requestedPatientsParsed);
        newUnaccessiblePatients=newUnaccessiblePatients-requestedPatientsParsed;
      }
      setUnacessiblePatients(newUnaccessiblePatients);
    }
    init();
  }, [])
  
  const filteredaccessiblePatients = accessiblePatients.length>0 ? accessiblePatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  ):[];

  const filteredRequestedPatients = requestedPatients.length>0 ? requestedPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTermUnaccessible.toLowerCase())
  ):[];

  const filteredUnaccessiblePatients = unaccessiblePatients.length>0 ? unaccessiblePatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTermUnaccessible.toLowerCase())
  ):[];

  const handleSelectPatient = (patient) => {
    setSelectedPatient((prev) => (prev? (prev.name === patient.name ? null : patient):patient));
  };

  const handleRawData = () => {
    navigate('/therapist/raw-data', { state: {patient:selectedPatient}})
  }

  const handleEvolution = () => {
    navigate('/therapist/evolution', { state: {patient:selectedPatient}});
  }

  const handleSendRequest = async (patient) => {
    const responseRequest = await fetch(process.env.REACT_APP_GENERAL_URL+"/therapist/requestPatient?user="+userID,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token"),
      },
      body:patient.name
    });
      if(responseRequest.ok){
        setRequestedPatients([...requestedPatients,patient]);
        setUnacessiblePatients(unaccessiblePatients.filter(p=>p!==patient));
      }
  }

  const handleHomePanel = () => {
    navigate('/')
  }

  return (
  <>
    <div className="sub-banner">
        <button className="nav-button" onClick={handleHomePanel}>Home</button> &gt; 
      Listado de pacientes
    </div>
    <div class="app">
      <h1 className="text-6xl text-stone-800 font-bold" style={{textAlign:"center"}}>¡BIENVENID@ TERAPEUTA!</h1>
      <p className="text-xl text-stone-800 mt-4" style={{textAlign:"center"}}>Nos alegramos de tenerte de vuelta. Le deseamos mucho ánimo en la gestión de sus pacientes y su análisis de datos.</p>
    <h1 class="main-title">Listado de pacientes</h1>
      <div class="patients-menu">
        <div className="list-container" style={{display:"grid", gridTemplateColumns:"1fr 1fr"}}>
          <div className="scrollable-list-patients">
            <h3 class="title">Mis pacientes</h3>
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            {filteredaccessiblePatients.map((patient, index) => (
              <div
                key={index}
                onClick={() => handleSelectPatient(patient)}
                className={`list-item ${selectedPatient === patient ?"selected" : ""}`}>
                {patient.name}
              </div>
            ))}
            {filteredaccessiblePatients.length<1&&(
               <h3 class={"introduction-text"}>Ya puedes solicitar acceso a los pacientes de tu centro.</h3>
            )}
            </div>
            <div className="scrollable-list-patients">
              <h3 class="title">Asignar pacientes</h3>
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={searchTermUnaccessible}
              onChange={(e) => setSearchTermUnaccessible(e.target.value)}
              className="search-bar"
            />
            {filteredRequestedPatients.map((patient, index) => (
              <div
                key={index}
                className={`list-item selected`}>
                {patient.name}  ...Esperando confirmación...
              </div>
            ))}
            {filteredUnaccessiblePatients.map((patient, index) => (
              <div
                key={index}
                className={`list-item`}>
                {patient.name}
                <button className="button-admin-new" onClick={()=>handleSendRequest(patient)}> Enviar solicitud </button>
              </div>
            ))}
            {filteredUnaccessiblePatients.length<1 && filteredRequestedPatients<1 &&(
               <h3 class={"introduction-text"}>Parece que aún no hay pacientes disponibles a los que solicitar gestión. Vuelva más tarde.</h3>
            )}
            </div>
          </div>
        {selectedPatient && (
        <div class={"rectangle"}>
          <div style={{display:"flex", justifyContent:"center"}}>
            <h3 class={"patient-name"}>{selectedPatient.name}</h3>
            <img style={{width:"50px", height:"70px"}} src={require("../media/RIAH_"+selectedPatient.gender+".png")}/>
          </div>
          <div style={{display:"grid",placeItems:"center"}}>
            <button className="button-new-patient" onClick={handleEvolution}>
                Gestionar evolución
            </button>
            <button className="button-new-patient" onClick={handleRawData}>
              Gestionar sesiones
            </button>
          </div>
          <Create_session patient={selectedPatient}></Create_session>
        </div>
        )}
      </div>
    </div>
    </>
  );
 }

export default Patients_list;