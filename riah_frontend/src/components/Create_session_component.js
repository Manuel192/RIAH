import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";
import { width } from "@mui/system";

function Create_session() {
    const location=useLocation();
    const navigate=useNavigate();
    const {user}=location.state;
    
    const [importedFileName, setImportedFileName] = useState("");
    const [importedData, setImportedData] = useState(null);
  
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState("");
    const [selectedDate, setselectedDate] = useState("");

    useEffect(() => {
        const fetchGames = async () => {
            try{
                const response = await fetch(process.env.REACT_APP_GENERAL_URL+'/game/loadGames');
                if(!response.ok){
                    setGames([]);
                    alert("No pudieron cargarse los juegos para filtrar.");
                    return;
                }
                // convert data to json
                const responseData = await response.json();
                setGames(responseData);
            }catch(error){
                alert("La web no funciona por el momento. Inténtelo más tarde.")
            }
        }
      
        // call the function
        fetchGames()
      }, []);

    const handleImportJson = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const jsonData = await JSON.parse(e.target.result);
            setImportedData(jsonData);
            setImportedFileName(file.name);
          } catch (error) {
            alert("Error parsing JSON file", error);
          }
        };
        reader.readAsText(file);
      }
    };

    const handleCreateSession = async () => {
        if(!user || !selectedDate || !selectedGame || !importedData){
            alert("Asegúrese de rellenar todos los campos e importar sus datos antes de crear una sesión.")
            return;
        }

        const responseCheck = await fetch(process.env.REACT_APP_SESSIONS_URL+'/rawDataSession/checkJson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ frames: importedData }),
        });

        if(!responseCheck.ok){
            alert("Formato de JSON o CSV inválido. Asegúrese de que se trata del fichero correcto.");
            return;
        }

        try {
            const response = await fetch(process.env.REACT_APP_GENERAL_URL+'session/insertSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ game: selectedGame, date: selectedDate, patient:user }),
            });

            const sessionId = await response.text();

            const responseMongo = await fetch(process.env.REACT_APP_SESSIONS_URL+'rawDataSession/insertSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: sessionId, frames: importedData }),
            });

            alert("Se ha creado la sesión correctamente");
            navigate('/')


        } catch (error) {
            alert("No se ha podido realizar la inserción. Inténtelo más tarde.")
        }
    }
  
    const handleGameChanged = (event) =>{
        setSelectedGame(event.target.value);
    }

    const handleSetselectedDate = (value) => {
        setselectedDate(value);
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
            <button className="nav-button" onClick={handlePatientList}>Listado de pacientes</button> &gt;
            Nueva sesión - Juan Pérez
        </div>
        <div class="app">
            <h1 className="titulo">Nueva sesión - Juan Pérez</h1>
            <div class="rectangle create-session">
                <h3>Juego</h3>
                <h3>Fecha</h3>
                <h3>Importar Datos</h3>
                <select id="dropdown" value={selectedGame} className="date-input create-session-field" onChange={handleGameChanged}>
                <option value="">Selecciona un juego</option>
                    {games?.map((option, index) => (
                        <option key={index} value={option.id}>
                        {option.name}
                        </option>
                    ))}
                </select>
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => handleSetselectedDate(e.target.value)} 
                    className="date-input create-session-field" 
                />
                <label className="boton-importar" htmlFor="import-json">
                    +
                    {importedFileName && <p className="nombre-archivo">{importedFileName}</p>}
                    </label>
                    <input
                    type="file"
                    id="import-json"
                    accept="application/json"
                    onChange={handleImportJson}
                    style={{ display: "none" }}
                    />
                </div>
            <button className="boton-crear-sesion" onClick={handleCreateSession}>CREAR SESIÓN</button>
            </div>
        </>
    );
}

export default Create_session;
