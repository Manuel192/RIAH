import React, { useState } from 'react';
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState(["Sesión 1", "Sesión 2", "Sesión 3"]);
  const [selectedDataItems, setSelectedDataItems] = useState(["fecha", "frame", "velManoDrch", "velManoIzqrd"]);
  const [tabs, setTabs] = useState(['Sesión 1', 'Sesión 2', 'Sesión 3']);

  const sessions = ["Sesión 1", "Sesión 2", "Sesión 3", "Sesión 4", "Sesión 5"];
  const dataItems = ["fecha", "frame", "velManoDrch", "velManoIzqrd"];

  const [activeTab, setActiveTab] = useState(0);

  const dataSesion1 = [
    { fecha: '2024-10-25', frame: 'Frame1', velManoDrch: '1.5', velManoIzqrd: '1.2', edit: false },
    { fecha: '2024-10-25', frame: 'Frame2', velManoDrch: '2.1', velManoIzqrd: '1.8', edit: false },
    { fecha: '2024-10-25', frame: 'Frame3', velManoDrch: '1.7', velManoIzqrd: '1.5', edit: false },
  ];

  const dataSesion2 = [
    { fecha: '2024-10-28', frame: 'Frame1', velManoDrch: '2.5', velManoIzqrd: '1.9', edit: false },
    { fecha: '2024-10-28', frame: 'Frame2', velManoDrch: '2.3', velManoIzqrd: '1.8', edit: false },
    { fecha: '2024-10-28', frame: 'Frame3', velManoDrch: '2.2', velManoIzqrd: '1.7', edit: false },
  ];

  const [data, setData]=useState(dataSesion1)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    // Acción de confirmación
    alert("Confirmado");
    setIsModalOpen(false);
  };

  const toggleSelection = (item, listType) => {
    if (listType === "sessions") {
      setTabs(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );

      setSelectedSessions(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
      );
    } else {
      setSelectedDataItems(prev =>
        prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
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
    setActiveTab(index);
    switch(index){
      default:
        setData([]);
        break;
      case 0:
        setData(dataSesion1);
        break;
      case 1:
        setData([]);
        setData(dataSesion2);
        break;
    }
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
              onChange={(e) => setStartDate(e.target.value)} 
              className="date-input" 
            />
          </div>
          <div className="date-field">
            <span>FECHA FIN</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="date-input" 
            />
          </div>
        </div>

        <div className="list-sections">
          <div className="list-container">
            <h3>SESIONES</h3>
            <div className="scrollable-list">
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className={`list-item ${selectedSessions.includes(session) ? "selected" : ""}`}
                  onClick={() => toggleSelection(session, "sessions")}
                >
                  {session}
                </div>
                ))}
            </div>
          </div>
          <div className="list-container">
            <h3>DATOS</h3>
            <div className="scrollable-list">
              {dataItems.map((data, index) => (
                <div
                  key={index}
                  className={`list-item ${selectedDataItems.includes(data) ? "selected" : ""}`}
                  onClick={() => toggleSelection(data, "dataItems")}
                >
                  {data}
                </div>
              ))}
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
            <thead>
              <tr className='table-header'>
              {selectedDataItems.includes("fecha")?
                <td>FECHA</td>
              :null}
              {selectedDataItems.includes("frame")?
                <td>FRAME</td>
              :null}
              {selectedDataItems.includes("velManoDrch")? 
                <td>VEL. MANO DRCH</td>
              :null}
              {selectedDataItems.includes("velManoIzqrd")? 
                <td>VEL. MANO IZQRD</td>
              :null}
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.frame}>
                  {selectedDataItems.includes("fecha")? 
                    <td><input type="text" value={row.fecha} className={`input${row.edit?"-edit":""}`}></input></td>
                  :null}
                  {selectedDataItems.includes("frame")?
                    <td>{row.frame}</td>
                  :null}
                  {selectedDataItems.includes("velManoDrch")?
                    <td>{row.velManoDrch}</td>
                  :null}
                  {selectedDataItems.includes("velManoIzqrd")?
                    <td>{row.velManoIzqrd}</td>
                  :null}
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