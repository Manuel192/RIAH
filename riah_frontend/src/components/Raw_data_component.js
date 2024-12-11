import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tabs from './Tabs_component';
import '../App.css';

function Modal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>¿Estás seguro?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button">Sí</button>
          <button onClick={onClose} className="cancel-button">No</button>
        </div>
      </div>
    </div>
  );
}

function Raw_data() {
  const navigate=useNavigate();
  const location=useLocation();
  const {user}=location.state;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [games, setGames] = useState([]);
  const [game, setGame] = useState("");
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedDataItems, setSelectedDataItems] = useState([]);
  const [tabs, setTabs] = useState([]);

  const [sessions, setSessions] = useState([]);
  const [dataItems,setDataItems] = useState([]);

  const [activeSession, setactiveSession] = useState([]);
  const [activeSessionData, setactiveSessionData] = useState([[]]);

  const [isModalOpen, setIsModalOpen] = useState(false);


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

  const handleSetStartDate = (value) => {
    setStartDate(value);
  }

  const handleSetEndDate = (value) => {
    setEndDate(value);
  }

  const loadSessions = async () => {
    if(startDate>endDate){
      alert("La fecha de inicio no debe ser posterior a la fecha de fin.");
      return;
    }
    const stDate=startDate?startDate:"X";
    const lDate=endDate?endDate:"X";
    const gameId=game?game:"X";
    try{
      const url="http://localhost:8081/session/loadFilteredSessions?firstDate="+stDate+"&lastDate="+lDate+"&gameId="+gameId;
      console.log(url);
      const response = await fetch(url);
      if(!response.ok){
        setSessions([]);
        alert("No hay sesiones para el usuario durante las fechas indicadas.");
        return;
      }
      const sessionData = await response.json();
      setSessions(sessionData);
    }catch(error){
      alert("La web no funciona por el momento. Inténtelo más tarde.")
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    // Acción de confirmaciónsession
    alert("Confirmado");
    setIsModalOpen(false);
  };

  const toggleSelection = async (item, listType) => {
    if (listType === "sessions") {
      if(activeSessionData?.id===item.id){
        setDataItems([]);
        setSelectedDataItems([]);
        setactiveSession();
        setactiveSessionData();
      }else if(selectedSessions.length===0){
        const sessionData=await obtainRawData(item);
        if(!sessionData){
          alert("No hay datos para esta sesión.");
          return;
        }
        setDataItems(sessionData.dataTypes);
        setSelectedDataItems([]);
        setactiveSession(item);
        setactiveSessionData(sessionData);
        console.log(item);
      }
      
      setSelectedSessions(prev =>
        prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
      );
      setTabs(prev =>
        prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
      );
    } else {
      setSelectedDataItems(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item].sort()
      );
    }
  };

  const obtainRawData = async (item) => {
    const url="http://localhost:9000/rawDataSession/loadSessionRawData?id="+item.id;
      console.log(url);
      const response = await fetch(url);
      if(!response.ok){
        return null;
      }
      const sessionData = await response.json();
      return sessionData;
  }

  const handleExport = () => {
    console.log("Datos exportados");
  };

  const handleTabChange = async (index) => {
    if(index!==activeSessionData?.id){
      const item = sessions.filter(i => index ===i.id)[0];
      const sessionData=await obtainRawData(item);
      if(!sessionData){
        alert("No hay datos para esta sesión.");
        return;
      }
      setDataItems(sessionData.dataTypes);
      setSelectedDataItems([]);
      setactiveSession(item);
      setactiveSessionData(sessionData);
    }
    console.log(startDate);
  };

  const handleGameChanged = (event) =>{
    setGame(event.target.value);
  }

  const handlePatientList = () => {
    navigate('/')
  }

  return (
    <div>
    <div className="sub-banner">
      <button className="nav-button">Home</button> &gt; 
      <button className="nav-button">Mi portal</button> &gt; 
      <button className="nav-button" onClick={handlePatientList}>Listado de pacientes</button> &gt;
      Gestión de sesiones - Juan Pérez
    </div>
    <div className="app">
    <h1>Juan Pérez</h1>
    <div className="filter-section">
    <h3>FILTROS</h3>
        <div className="date-fields">
          <div className="date-field">
            <span>FECHA INICIO</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => handleSetStartDate(e.target.value)} 
              className="date-input" 
            />
          </div>
          <div className="date-field">
            <span>FECHA FIN</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => handleSetEndDate(e.target.value)} 
              className="date-input" 
            />
          </div>
          <div className="date-field">
            <span>JUEGO</span>
            <select id="dropdown" className='date-input' value={game} onChange={handleGameChanged}>
              <option value="">Ninguno</option>
              {games?.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn search " onClick={loadSessions}>Buscar</button>
        </div>

        <div className="list-sections">
          <div className="list-container">
            <h3>SESIONES</h3>
            <div className="scrollable-list">
              {sessions?.map((session, index) => (
                <div
                  key={index}
                  className={`list-item ${selectedSessions.includes(session.id) ? "selected" : ""}`}
                  onClick={() => toggleSelection(session, "sessions")}
                >
                  {session.id}
                  <label className="secondary-txt">{session.date}</label>
                  <label className="secondary-txt">{session.game}</label>
                </div>
                ))}
            </div>
          </div>
          <div className="list-container">
            <h3>DATOS</h3>
            <div className="scrollable-list">
              {dataItems?.length>0?dataItems.sort().map((data, index) => (
                <div
                key={index}
                  className={`list-item ${selectedDataItems.includes(data) ? "selected" : ""}`}
                  onClick={() => toggleSelection(data, "dataItems")}
                >
                  {data}
                </div>
              )):""}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para confirmar */}
      {isModalOpen && <Modal onClose={handleCloseModal} onConfirm={handleConfirm} />}

      
      <Tabs tabs={tabs} onTabChange={handleTabChange} />
      {selectedSessions?.length>0?
        <div className="table-container">
          <table>
            <thead className='table-header'>
              <th>Id</th>
              {selectedDataItems?.map((data)=>
                  <th>{data}</th>
              )}
            </thead>
            <tbody className='table-body'>
              {activeSessionData?.frames.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{rowIndex}</td>
                  {Object.keys(row?.dataValues).sort().map((data, colIndex) => (
                    selectedDataItems.includes(data)?
                    <td key={colIndex}>{row.dataValues[data] || ""}</td>
                  :""))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        :null}
      {selectedSessions?.length>0?
      <div className="button-bar">
        <button className="btn red" onClick={handleOpenModal}>LIMPIAR SESIÓN</button>
        <button className="btn green" onClick={handleExport}>EXPORTAR</button>
      </div>
      :null}
    </div>
    </div>
  );
}

export default Raw_data;