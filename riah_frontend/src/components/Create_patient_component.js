import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from "./video_player";
import '../css/Create_session_component.css';
import "../App.css";
import { addAfterEffect } from "@react-three/fiber";

function Create_Patient() {
    const location=useLocation();
    const navigate=useNavigate();

    // Tratamos con una aplicación de gestión médica: se toman únicamente en cuenta los géneros biológicos sin afán de ofender a los colectivos no binarios.
    const genders=["Masculino","Femenino","NA"];
  
    const [hospitals, setHospitals] = useState([]);
    const [name, setName] = useState("");
    const [birthdate, setBirthdate] = useState();
    const [gender, setGender] = useState("");
    const [hospital, setHospital] = useState("");

    useEffect(()=>{
        const fetchHospitals = async () => {
          try{
            const responseHospitals = await fetch(process.env.REACT_APP_GENERAL_URL+"/hospital/loadHospitals");
            if(!responseHospitals.ok){
              return;
            }
            // convert data to json
            const hospitalsParsed = await responseHospitals.json();
            setHospitals(hospitalsParsed);
          }catch(error){}
        }
        fetchHospitals();
      }, [])

    const handleCreatePatient = async () => {
        if(!name || !birthdate || !hospital || !gender){
            console.log(name+birthdate+hospital+gender);
            alert("Asegúrese de rellenar todos los campos e importar sus datos antes de crear una sesión.")
            return;
        }
        try {
            await fetch(process.env.REACT_APP_GENERAL_URL+'/patient/insertPatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, birthdate: birthdate, gender:gender, hospital: hospital }),
            });
            setName("");
            setBirthdate();
            setGender("");
            setHospital("");
            alert("Se ha creado el paciente correctamente");
        } catch (error) {
            alert(error)
        }
    }
  
    const handleHospitalChanged = (event) =>{
        setHospital(event.target.value);
    }

    const handleGenderChanged = (event) =>{
        setGender(event.target.value);
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
            <button className="nav-button" onClick={handlePatientList}>Listado de pacientes</button> &gt;
            Nueva sesión - John Doe
        </div>
        <div class="app">
            <h3 class="main-title">Crear pacientes</h3>
            <div class="rectangle">
                <div class="create-session">
                    <div class="create-session-section">
                        <h3 class="title">Nombre</h3>
                        <input 
                            value={name} 
                            placeholder="Nombre"
                            onChange={(e) => setName(e.target.value)} 
                            className="create-session-field" 
                        />
                    </div>
                    <div class="create-session-section">
                        <h3 class="title">Fecha de nacimiento</h3>
                        <input 
                            type="date"
                            placeholder="Fecha de nacimiento"
                            value={birthdate} 
                            onChange={(e) => setBirthdate(e.target.value)} 
                            className="date-input" 
                        />
                    </div>
                    <div class="create-session-section">
                        <h3 class="title">Género</h3>
                        <select id="dropdown" value={gender} className="create-session-field" onChange={handleGenderChanged}>
                        <option value="" disabled="true">Selecciona un género</option>
                            {genders?.map((option, index) => (
                                <option key={index} value={option}>
                                {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div class="create-session-section">
                        <h3 class="title">Hospital</h3>
                        <select id="dropdown" value={hospital} className="create-session-field" onChange={handleHospitalChanged}>
                        <option value="" disabled="true">Selecciona un hospital</option>
                            {hospitals?.map((option, index) => (
                                <option key={index} value={option.id}>
                                {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="button-create-session" onClick={handleCreatePatient}>CREAR PACIENTE</button>
                </div>
             </div>
        </div>
        </>
    );
}

export default Create_Patient;