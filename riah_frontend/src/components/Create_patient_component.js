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
    const genders=["Masculino","Femenino","Sin especificar"];
  
    const [hospitals, setHospitals] = useState([]);
    const [name, setName] = useState("");
    const [age, setAge] = useState();
    const [gender, setGender] = useState("");
    const [hospital, setHospital] = useState("");

    /*useEffect(() => {
        const fetchGames = async () => {
            try{
                const response = await fetch(process.env.REACT_APP_GENERAL_URL+'/hospital/loadHospitals');
                if(!response.ok){
                    setGames([]);
                    return;
                }
                // convert data to json
                const responseData = await response.json();
                setGames(responseData);
            }catch(error){
            }
        }
      
        // call the function
        fetchGames()
      }, []);*/

    const handleCreateSession = async () => {
        if(!name || !age || !hospital || !gender){
            alert("Asegúrese de rellenar todos los campos e importar sus datos antes de crear una sesión.")
            return;
        }

        try {
            await fetch(process.env.REACT_APP_GENERAL_URL+'/patient/insertPatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, age: age, gender:gender, hospital: hospital }),
            });
            setName("");
            setAge();
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
            <div class="rectangle create-session">
                <h3 class="title">Nombre</h3>
                <h3 class="title">Edad</h3>
                <div>
                    <input 
                        value={name} 
                        placeholder="Nombre"
                        onChange={(e) => setName(e.target.value)} 
                        className="date-input" 
                    />
                </div>
                <div>
                    <input 
                        type="number"
                        placeholder="Edad"
                        value={age} 
                        onChange={(e) => setAge(e.target.value)} 
                        className="hour-input" 
                    />
                </div>
                <h3 class="title">Género</h3>
                <h3 class="title">hospital</h3>
                <div>
                    <select id="dropdown" value={hospital} className="date-input create-session-field" onChange={handleHospitalChanged}>
                    <option value="" disabled="true">Selecciona un género</option>
                        {genders?.map((option, index) => (
                            <option key={index} value={option}>
                            {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <select id="dropdown" value={hospital} className="date-input create-session-field" onChange={handleHospitalChanged}>
                    <option value="" disabled="true">Selecciona un hospital</option>
                        {hospitals?.map((option, index) => (
                            <option key={index} value={option.id}>
                            {option.name}
                            </option>
                        ))}
                    </select>
                </div>
                
             </div>
            <button className="button-create-session" onClick={handleCreateSession}>CREAR PACIENTE</button>
        </div>
        </>
    );
}

export default Create_Patient;