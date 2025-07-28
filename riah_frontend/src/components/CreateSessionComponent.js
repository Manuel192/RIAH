import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from "./VideoPlayer";
import '../css/CreateSessionComponent.css';
import "../App.css";

function CreateSession({patient}) {

      const [isModalOpen, setIsModalOpen] = useState(false);
    
      function Modal({ onClose, onConfirm }) {
      return (
        <div className="modal-overlay">
          <div className="modal">
            <h3 style={{fontSize:"40px", fontWeight:"bold"}}>Versión antigua</h3>
            <p>La sesión que acaba de ser importada pertenece a una versión antigua del juego Box & Blocks. ¿Desea acceder al panel de versiones para instalar la versión más reciente?</p>
            <div className="modal-buttons">
              <button onClick={onConfirm} className="button-confirm">Sí</button>
              <button onClick={onClose} className="button-cancel">No</button>
            </div>
          </div>
        </div>
      );
    }
    
    
      const handleOpenModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };
    
      const handleConfirm = () => {
        navigate("/versions")
      };

    const navigate=useNavigate();
    
    const [importedFileName, setImportedFileName] = useState("");
    const [importedRawData, setImportedRawData] = useState("");
    const [importedData, setImportedData] = useState(null);

    const [videoId, setVideoId] = useState("");
    const [videoData, setVideoData] = useState();
  
    const [games, setGames] = useState([]);
    const [versions, setVersions] = useState([]);
    const [selectedGame, setSelectedGame] = useState("");
    const [selectedVersion, setSelectedVersion] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedHour, setSelectedHour] = useState();
    const [selectedMinute, setSelectedMinute] = useState();
    const [selectedSecond, setselectedSecond] = useState();

    useEffect(() => {
        const init = async () => {
            try{
                const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/loadGames?token="+sessionStorage.getItem("token"));
                if(!response.ok){
                    setGames([]);
                    return;
                }
                // convert data to json
                const responseData = await response.json();
                setGames(responseData);

                const responseVersions = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/loadVersions?token="+sessionStorage.getItem("token"));
                if(!responseVersions.ok){
                    setGames([]);
                    return;
                }
                // convert data to json
                const responseVersionsData = await responseVersions.json();
                setVersions(responseVersionsData);
            }catch(error){
            }
        }
        init();
      }, []);

    const handleImportJson = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content=e.target.result;
            setImportedRawData(content);

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
            var jsonData="";
            if(fileExtension==="json"){
                jsonData = await JSON.parse(content);
                setImportedData(jsonData);
            }else if(fileExtension === "csv"){
                jsonData = parseCSVtoJSON(content);
                setImportedData(jsonData);
            }
            const detectedGameId=games.filter(g=>g.name===file.name.split("_")[0]);
            if(detectedGameId.length>0){
                setSelectedGame(detectedGameId[0].id);
                const detectedVersion=versions.filter(v=>(v.game===detectedGameId[0].id && v.name===jsonData[0]["Version"]));
                if(detectedVersion.length>0){
                    setSelectedVersion(detectedVersion[0].id);
                }
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
        if(!selectedDate || !selectedGame || !importedData || !selectedHour || !selectedMinute || !selectedSecond){
            alert("Asegúrese de rellenar todos los campos e importar sus datos antes de crear una sesión.")
            return;
        }

        var videoObtained="";

        if(videoId!==""){
            videoObtained=await handleUpload();
            if(videoObtained===0){
                alert("El vídeo no debe superar el límite de 20MB de memoria.");
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

            console.log({ version: selectedVersion, date: selectedDate+" "+selectedHour+":"+selectedMinute+":"+selectedSecond, patient:patient.id, video_id:videoObtained, data_id: dataId });
            await fetch(process.env.REACT_APP_GENERAL_URL+'/session/insertSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ version: selectedVersion, date: selectedDate+" "+selectedHour+":"+selectedMinute+":"+selectedSecond, patient:patient.id, video_id:videoObtained, data_id: dataId }),
            });
            if(new Date(versions.filter(v=>v.id===selectedVersion)[0].date)<new Date(Math.max(...versions.filter(v=>(v.game===selectedGame && v.date!==null)).map(v=>new Date(v.date))))){
                handleOpenModal();
            }
            setSelectedVersion("");
            setSelectedGame("");
            setSelectedDate("");
            setSelectedHour("");
            setSelectedMinute("");
            setselectedSecond("");
            setImportedData();
            setImportedRawData();
            setImportedFileName("");
            setVideoData();
            setVideoId("");
            alert("Se ha creado la sesión correctamente");
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
        if(event.target.files.length>0){
            await setVideoId("");
            setVideoData(event.target.files[0]);
            setVideoId(URL.createObjectURL(event.target.files[0]));
            console.log(videoData);
        }
    }
  
    const handleGameChanged = (event) =>{
        setSelectedGame(event.target.value);
    }

    const handleVersionChanged = (event) =>{
        setSelectedVersion(event.target.value);
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
        navigate('/therapist/patients-list')
    }

    const handleHomePanel = () => {
    navigate('/')
    }

    return (
    <>
    {isModalOpen && (<Modal onClose={handleCloseModal} onConfirm={handleConfirm} />)}
            <div class="rectangle" style={{ margin:"auto"}}>
                <h3 class="main-title">Guardar sesiones</h3>
                <div class="create-session">
                    <div class="create-session-section">
                        <h3 class="title">Vídeo demostrativo {"(Límite: 20MB)"}</h3>
                        <input className="button-import filename" type="file" accept="video/*" onChange={handlePreview} />
                        {videoId && <VideoPlayer videoId={videoId} preview={true} />}
                    </div>
                    <div class="create-session-section">
                        <h3 class="title">Datos de sesión</h3>
                        <label className="button-import" htmlFor="import-json-csv">
                            {importedFileName? <p className="filename">{importedFileName}</p>:"+"}
                        </label>
                        {importedRawData && (
                            <p className="imported-raw-data">
                                {importedRawData}
                            </p>
                        )}
                    </div>
                    <div class="create-session-section">
                        <h3 class="title">Juego</h3>
                            <select id="dropdown" value={selectedGame} className="date-input create-session-field" onChange={handleGameChanged}>
                            <option value="" disabled="true">Selecciona un juego</option>
                                {games?.map((option, index) => (
                                    <option key={index} value={option.id}>
                                    {option.name}
                                    </option>
                                ))}
                            </select>
                    </div>
                    <div class="create-session-section">
                        <h3 class="title">Versión</h3>
                            <select id="dropdown" value={selectedVersion} className="date-input create-session-field" onChange={handleVersionChanged}>
                            <option value="" disabled="true">Selecciona una versión</option>
                                {versions.filter(v=>v.game===selectedGame)?.map((option, index) => (
                                    <option key={index} value={option.id}>
                                    {option.name}
                                    </option>
                                ))}
                            </select>
                    </div>
                    <div class="create-session-section">
                    <h3 class="title">Fecha y hora</h3>
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
                    </div>
                    <button className="button-new-patient" onClick={handleCreateSession}>Guardar sesión</button>
                </div>
             </div>
        </>
    );
}

export default CreateSession;