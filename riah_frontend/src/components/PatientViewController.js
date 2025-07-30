import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Create_session from './CreateSessionComponent';
import '../css/PatientsListComponent.css';
import '../App.css';

function Patient_view({redirect}) {
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [requestedTherapists, setRequestedTherapists] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [patient, setPatient] = useState(null);

  useEffect(()=>{
    const init = async () => {
      const patientID=await redirect();
      const responsePatient = await fetch(process.env.REACT_APP_GENERAL_URL+"/patient/loadPatient?patientID="+patientID,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
      if(!responsePatient.ok){
        navigate("/");
      }
      const patientParsed = await responsePatient.json();
      setPatient(patientParsed);

      const responseRequestedTherapists = await fetch(process.env.REACT_APP_GENERAL_URL+"/therapist/loadRequestedTherapists?user="+patientID,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
      if(responseRequestedTherapists.ok){
        const requestedTherapistsParsed = await responseRequestedTherapists.json();
        setRequestedTherapists(requestedTherapistsParsed);
      }

      const responseTherapists = await fetch(process.env.REACT_APP_GENERAL_URL+"/therapist/loadTherapists?user="+patientID,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
      if(responseTherapists.ok){
        const therapistsParsed = await responseTherapists.json();
        setTherapists(therapistsParsed);
      }
    }
    init();
  }, [])
  
  const filteredTherapists = therapists.length>0 ? therapists.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  ):[];

  const filteredRequestedTherapists = requestedTherapists.length>0 ?  requestedTherapists.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  ):[];

  const handleRawData = () => {
    navigate('/patient/raw-data', { state: {patient:patient}})
  }

  const handleEvolution = () => {
    navigate('/patient/evolution', { state: {patient:patient}});
  }

  const handleAcceptRequest = async (therapist) => {
    const responseRequest = await fetch(process.env.REACT_APP_GENERAL_URL+"/patient/acceptRequest?user="+patient.id,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token"),
      },
      body:therapist.id
    });
      if(responseRequest.ok){
        setRequestedTherapists(requestedTherapists.filter(t=>t!=therapist));
        setTherapists([...therapists,therapist]);
      }
  }

   const handleRejectRequest = async (therapist) => {
    const responseRequest = await fetch(process.env.REACT_APP_GENERAL_URL+"/patient/rejectRequest?user="+patient.id,{
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token"),
      },
      body:therapist.id
    });
      if(responseRequest.ok){
        setRequestedTherapists(requestedTherapists.filter(t=>t!=therapist));
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
      <h1 className="text-6xl text-stone-800 font-bold" style={{textAlign:"center"}}>¡BIENVENID@ {patient?patient.name:"PACIENTE"}!</h1>
      <p className="text-xl text-stone-800 mt-4" style={{textAlign:"center"}}>Nos alegramos de tenerte de vuelta. Le deseamos mucho ánimo en la gestión y análisis de sus datos y terapeutas.</p>
    <h1 class="main-title">Listado de terapeutas</h1>
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
            {filteredTherapists.map((therapist, index) => (
              <div
                key={index}
                className={`list-item`}>
                {therapist.name}
              </div>
            ))}
            {filteredRequestedTherapists.map((therapist, index) => (
              <div
                key={index}
                className={`list-item selected`}>
                {therapist.name}
                <button className="button-admin-cancel" onClick={()=>handleRejectRequest(therapist)}> Rechazar </button>
                <button className="button-admin-new" onClick={()=>handleAcceptRequest(therapist)}> Aceptar </button>
              </div>
            ))}
            {filteredTherapists.length<1&&filteredRequestedTherapists.length<1&&(
               <h3 class={"introduction-text"}>Ya puedes empezar a recibir solicitudes de supervisión de tus terapeutas.</h3>
            )}
            </div>
        {patient && (
        <div class={"rectangle"}>
          <div style={{display:"flex", justifyContent:"center"}}>
            <h3 class={"patient-name"}>{patient.name}</h3>
            <img style={{width:"50px", height:"70px"}} src={require("../media/RIAH_"+patient.gender+".png")}/>
          </div>
          <div style={{display:"grid",placeItems:"center"}}>
            <button className="button-new-patient" onClick={handleEvolution}>
                Gestionar evolución
            </button>
            <button className="button-new-patient" onClick={handleRawData}>
              Gestionar sesiones
            </button>
          </div>
          <Create_session patient={patient}></Create_session>
        </div>
        )}
      </div>
      </div>
      </div>
    </>
  );
 }

export default Patient_view;