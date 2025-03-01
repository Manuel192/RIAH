import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from "./video_player";
import '../css/Create_session_component.css';
import "../App.css";

function Create_session() {
    const location=useLocation();
    const navigate=useNavigate();
    const {user}=location.state;
    
    const [importedFileName, setImportedFileName] = useState("");
    const [importedData, setImportedData] = useState(null);

    const [videoId, setVideoId] = useState("");
    const [videoData, setVideoData] = useState();
  
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedHour, setSelectedHour] = useState();
    const [selectedMinute, setSelectedMinute] = useState();
    const [selectedSecond, setselectedSecond] = useState();

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
            const content=e.target.result;

            // Parseo de nombre
            setImportedFileName(file.name);
            const fullDate=file.name.split("_");
            if(fullDate.length===3){
                setSelectedDate(fullDate[1].substring(0,4)+"-"+fullDate[1].substring(4,6)+"-"+fullDate[1].substring(6));
                setSelectedHour(fullDate[2].substring(0,2));
                setSelectedMinute(fullDate[2].substring(2,4));
                setselectedSecond(fullDate[2].substring(4,6));
            }

            const fileExtension = file.name.split(".").pop().toLowerCase();
            if(fileExtension==="json"){
                const jsonData = await JSON.parse(content);
                setImportedData(jsonData);
            }else if(fileExtension === "csv"){
                const jsonData = parseCSVtoJSON(content);
                setImportedData(jsonData);
            }
          } catch (error) {
            alert("Error parsing JSON file", error);
          }
        };
        reader.readAsText(file);
      }
    };

    const parseCSVtoJSON = (csvString) => {
        const lines = csvString.trim().split("\n");
        const headers = lines[0].split(";").map(header => header.trim());
        const result = lines.slice(1).map(line => {
          const values = line.split(";").map(value => value.trim());
          let obj = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || ""; // Asigna valores a las claves correctas
          });
          return obj;
        });
        return result;
      };

    const handleCreateSession = async () => {
        if(!user || !selectedDate || !selectedGame || !importedData || !selectedHour || !selectedMinute || !selectedSecond){
            alert("Asegúrese de rellenar todos los campos e importar sus datos antes de crear una sesión.")
            return;
        }

        var videoObtained="";

        if(videoId!==""){
            videoObtained=await handleUpload();
            if(videoObtained===0){
                alert("El tamaño de vídeo es demasiado extenso. El vídeo no debe superar 1MB de memoria.");
                return;
            }
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
            const response = await fetch(process.env.REACT_APP_SESSIONS_URL+'/rawDataSession/insertSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ frames: importedData }),
            });

            const dataId = await response.text();

            await fetch(process.env.REACT_APP_GENERAL_URL+'/session/insertSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ game: selectedGame, date: selectedDate+" "+selectedHour+":"+selectedMinute+":"+selectedSecond, patient:user, video_id:videoObtained, data_id: dataId }),
            });

            alert("Se ha creado la sesión correctamente");
            navigate('/')


        } catch (error) {
            alert(error)
        }
    }

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", videoData);
        try{
            const response = await fetch(process.env.REACT_APP_SESSIONS_URL+"/video/uploadVideo", {
            method: "POST",
            body: formData,
            });

            if(!response.ok){
                console.log("Ha ido mal.");
                return 0;
            }
        
            const result = await response.text();
            setVideoId(result);
            return result;

        }catch(error){
            console.log("Ha ido mal.");
            return 0;
        }
    };

    const handlePreview = async (event) => {
        setVideoId(URL.createObjectURL(event.target.files[0]));
        setVideoData(event.target.files[0]);
    }
  
    const handleGameChanged = (event) =>{
        setSelectedGame(event.target.value);
    }

    const handleSetSelectedDate = (value) => {
        setSelectedDate(value);
    }

    const handleSetSelectedHour = (value) => {
        if(value>=0 && value <= 23)
            setSelectedHour(value);
        if(value===-1)
            setSelectedHour(23);
        if(value===24)
            setSelectedHour(0);
    }

    const handleSetselectedMinute = (value) => {
        if(value>=0 && value <= 59)
            setSelectedMinute(value);
        if(value===-1)
            setSelectedMinute(59);
        if(value===60)
            setSelectedMinute(0);
    }

    const handleSetselectedSecond = (value) => {
        if(value>=0 && value <= 59)
            setselectedSecond(value);
        if(value===-1)
            setselectedSecond(59);
        if(value===60)
            setselectedSecond(0);
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
            <h1 class="main-title" className="title">Datos importados</h1>
            <div class="rectangle create-session">
                <h3>Juego</h3>
                <h3>Datos</h3>
                <h3>Fecha y hora</h3>
                <select id="dropdown" value={selectedGame} className="date-input create-session-field" onChange={handleGameChanged}>
                <option value="">Selecciona un juego</option>
                    {games?.map((option, index) => (
                        <option key={index} value={option.id}>
                        {option.name}
                        </option>
                    ))}
                </select>
                <label className="button-import" htmlFor="import-json-csv">
                    +
                    {importedFileName && <p className="filename">{importedFileName}</p>}
                    </label>
                    <input
                    type="file"
                    id="import-json-csv"
                    accept=".json,.csv"
                    onChange={handleImportJson}
                    style={{ display: "none" }}
                    />
                    <div>
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => handleSetSelectedDate(e.target.value)} 
                        className="date-input" 
                    />
                    <input 
                        type="number"
                        placeholder="HH"
                        value={selectedHour} 
                        onChange={(e) => handleSetSelectedHour(e.target.value)} 
                        className="hour-input" 
                    />
                    :
                    <input 
                        type="number"
                        placeholder="MM"
                        value={selectedMinute} 
                        onChange={(e) => handleSetselectedMinute(e.target.value)} 
                        className="hour-input" 
                    />
                    :
                    <input 
                        type="number"
                        placeholder="SS"
                        value={selectedSecond} 
                        onChange={(e) => handleSetselectedSecond(e.target.value)} 
                        className="hour-input" 
                    />
                </div>
                <div>
                    <h1>Subir y Reproducir Video</h1>
                    <input type="file" accept="video/*" onChange={handlePreview} />
                    {videoId && <VideoPlayer videoId={videoId} preview={true} />}
                </div>
            </div>
            <button className="button-create-session" onClick={handleCreateSession}>CREAR SESIÓN</button>
            </div>
        </>
    );
}

export default Create_session;