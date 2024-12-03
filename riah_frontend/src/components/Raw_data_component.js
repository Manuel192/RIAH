import React, { act, useState } from 'react';
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedDataItems, setSelectedDataItems] = useState([]);
  const [tabs, setTabs] = useState([]);

  const [sessions, setSessions] = useState([]);
  const [dataItems,setDataItems] = useState([]);

  const [activeSession, setActiveSession] = useState([[]]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSetStartDate = (value) => {
    if(endDate){
      if(endDate<value){
        alert("La fecha de inicio no debe ser posterior a la fecha de fin.");
        return;
      }
      setStartDate(value);
      loadSessionsRawData(value, endDate);
    }else
      setStartDate(value);
  }

  const handleSetEndDate = (value) => {
    if(startDate){
      if(startDate>value){
        alert("La fecha de inicio no debe ser posterior a la fecha de fin.");
        return;
      }
      setEndDate(value);
      loadSessionsRawData(startDate, value);
    }else
      setEndDate(value);
  }

  const loadSessionsRawData = async (start,end) => {
    const url="/session/loadSessionsRawData?firstDate="+start+"&lastDate="+end;
    const response = await fetch(url);
    const sessionData = await response.json();
    if(sessionData.length>0)
      setSessions(sessionData);
    else
      alert("No hay sesiones para el usuario durante las fechas indicadas.");
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

  const toggleSelection = (item, listType) => {
    if (listType === "sessions") {
      if(activeSession?.id===item.id){
        setDataItems([]);
        setSelectedDataItems([]);
        setActiveSession();
      }else if(selectedSessions.length===0){
        setDataItems(item.dataTypes);
        setSelectedDataItems([]);
        setActiveSession(item);
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

  const handleStartDateClick = () => {
    // Código para abrir un selector de fecha (puedes usar un DatePicker de una librería externa)
    setStartDate(new Date().toLocaleDateString());
  };

  const handleEndDateClick = () => {
    // Código para abrir un selector de fecha (puedes usar un DatePicker de una librería externa)
    setEndDate(new Date().toLocaleDateString());
  };

  const handleLimpiarSesion = () => {
    console.log("Sesión limpiada");
  };

  const handleExportar = () => {
    console.log("Datos exportados");
  };

  const handleTabChange = (index) => {
    if(index!==activeSession?.id){
      const item = sessions.filter(i => index ===i.id)[0];
      setDataItems(item.dataTypes);
      setSelectedDataItems([]);
      setActiveSession(item);
    }
    console.log(startDate);
  };

  return (
    <div>
    <div className="sub-banner">
      <button className="nav-button">Home</button> &gt; 
      <button className="nav-button">Mi portal</button> &gt; 
      <button className="nav-button">Listado de pacientes</button> &gt;
      <button className="nav-button">Evolución</button> &gt;
      Gestión de sesiones
    </div>
    <div className="app">

    <div className="filter-section">
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
                </div>
                ))}
            </div>
          </div>
          <div className="list-container">
            <h3>DATOS</h3>
            <div className="scrollable-list">
              {dataItems.length>0?dataItems.sort().map((data, index) => (
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
      {selectedSessions.length>0?
        <div className="table-container">
          <table>
            <thead className='table-header'>
              <th>Id</th>
              {selectedDataItems?.map((data)=>
                  <th>{data}</th>
              )}
              <th>Opciones</th>
            </thead>
            <tbody>
              {activeSession?.frames.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{rowIndex}</td>
                  {Object.keys(row?.dataValues).sort().map((data, colIndex) => (
                    selectedDataItems.includes(data)?
                    <td key={colIndex}>{row.dataValues[data] || ""}</td>
                  :""))}
                  <td>
                      <button className="action-btn">Editar</button>
                      <button className="action-btn" onClick={handleOpenModal}>Limpiar</button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-add">
              + 
            </button>
        </div>
        :null}
      {selectedSessions.length>0?
      <div className="button-bar">
        <button className="btn red" onClick={handleOpenModal}>LIMPIAR SESIÓN</button>
        <button className="btn green" onClick={handleExportar}>EXPORTAR</button>
      </div>
      :null}
    </div>
    </div>
  );
}

export default Raw_data;