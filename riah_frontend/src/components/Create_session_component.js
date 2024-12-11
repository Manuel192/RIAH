import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";

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
                const response = await fetch('http://localhost:8081/game/loadGames');
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
            console.log(jsonData);
            setImportedFileName(file.name);
          } catch (error) {
            console.error("Error parsing JSON file", error);
          }
        };
        reader.readAsText(file);
      }
    };

    const handleCreateSession = async () => {
        try {
            if(!user || !selectedDate || !selectedGame || !importedData){
                alert("Asegúrese de rellenar todos los campos e importar sus datos antes de crear una sesión.")
                return;
            }
            const response = await fetch('http://localhost:8081/session/insertSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ game: selectedGame, date: selectedDate, patient:user }),
            });

            const sessionId = await response.text();

            const responseMongo = await fetch('http://localhost:9000/rawDataSession/insertSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: sessionId, frames: importedData }),
            });

            alert("Se ha creado la sesión correctamnte");
            navigate('/')


        } catch (error) {
            alert("No se ha podido realizar la inserción. Inténtelo más tarde.")
        }
    }
  
    const handleGameChanged = (event) =>{
        setSelectedGame(event.target.value);
        console.log(event.target.value);
    }

    const handleSetselectedDate = (value) => {
        setselectedDate(value);
    }   

    return (
    <>
        <div className="sub-banner">
            <button className="nav-button">Home</button> &gt; 
            <button className="nav-button">Mi portal</button> &gt; 
            Listado de pacientes
        </div>
        <div class="app">
            <h1 className="titulo">Nueva sesión</h1>
    
            <hr className="linea-delimitadora" />
            <div>
                <div class="importar">
                    <h3>Importar Datos</h3>
                    <label className="boton-importar" htmlFor="import-json">
                        +
                        </label>
                        <input
                        type="file"
                        id="import-json"
                        accept="application/json"
                        onChange={handleImportJson}
                        style={{ display: "none" }}
                        />
                    {importedFileName && <p className="nombre-archivo">{importedFileName}</p>}
                </div>
                <h3>Juego</h3>
                <select id="dropdown" value={selectedGame} className="date-input" onChange={handleGameChanged}>
                <option value="">Ninguno</option>
                    {games?.map((option, index) => (
                        <option key={index} value={option.id}>
                        {option.name}
                        </option>
                    ))}
                </select>
                <h3>Fecha</h3>
                <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => handleSetselectedDate(e.target.value)} 
                className="date-input" 
                />
            </div>
            <hr className="linea-delimitadora" />
    
            <button className="boton-crear-sesion" onClick={handleCreateSession}>CREAR SESIÓN</button>
            </div>
        </>
    );
}

export default Create_session;
