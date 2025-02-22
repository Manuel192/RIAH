import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AreaChart, BarChart, Card, Title } from "@tremor/react";
import Tabs from './Tabs_component';
import '../css/Raw_data_component.css';
import '../App.css';

function Modal({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>¿Estás seguro?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="button-confirm">Sí</button>
          <button onClick={onClose} className="button-cancel">No</button>
        </div>
      </div>
    </div>
  );
}

const getRandomColors = (numColors, index) => {
  const tremorColors = [
    "blue", "sky", "cyan", "teal", "green", "lime",
    "yellow", "amber", "orange", "red", "rose", "pink",
    "fuchsia", "purple", "violet", "indigo", "gray", "stone"
  ];
  return Array.from({ length: numColors }, () =>
    tremorColors[index%tremorColors.length]
  );
};

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
  const [selectedDataItemsValues, setSelectedDataItemsValues] = useState({});
  const [tabs, setTabs] = useState([]);

  // Whole sessions data
  const [sessions, setSessions] = useState([]);
  // Data items names
  const [dataItems,setDataItems] = useState([]);

  // Selected session data
  const [activeSession, setactiveSession] = useState([]);
  // Seleted data items names
  const [activeSessionData, setactiveSessionData] = useState([[]]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const exportDataToCsv = async () => {
    var dataString = "";
    if(selectedDataItems.length<1){
      alert("Error al exportar: no se han seleccionado parámetros.");
      return;
    }
    for(var i=0; i<selectedDataItems.length;i++)
      dataString+=selectedDataItems[i]+";";
    for(var i=0;i<activeSessionData.frames.length;i++){
      dataString+="\n";
      for(var j=0; j<selectedDataItems.length;j++){
        dataString+=activeSessionData.frames[i].dataValues[selectedDataItems[j]]+";";
      }
    }
    const blob = new Blob([dataString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = activeSession.id;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const handleSetStartDate = (value) => {
    setStartDate(value);
  }

  const handleSetEndDate = (value) => {
    setEndDate(value);
  }

  const loadSessions = async () => {
    if((startDate&&!endDate) || (!startDate&&endDate)){
      alert("Ha indicado únicamente un campo de fecha. Para filtrar por fecha, debe marcar ambos.");
      return;
    }

    if(startDate>endDate){
      alert("La fecha de inicio no debe ser posterior a la fecha de fin.");
      return;
    }
    const stDate=startDate?startDate:"X";
    const lDate=endDate?endDate:"X";
    const gameId=game?game:"X";
    try{
      const url=process.env.REACT_APP_GENERAL_URL+"/session/loadFilteredSessions?firstDate="+stDate+"&lastDate="+lDate+"&gameId="+gameId;
      const response = await fetch(url);
      if(!response.ok){
        setSessions([]);
        alert("El paciente no ha realizado sesiones que cumplan con el filtro establecido.");
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
      }
      
      setSelectedSessions(prev =>
        prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
      );
      setTabs(prev =>
        prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
      );
    } else {
      if(selectedDataItems.includes(item)){
        setSelectedDataItems(selectedDataItems.filter(i => i !== item));
        const newDataItemValues={...selectedDataItemsValues}
        delete newDataItemValues[item];
        setSelectedDataItemsValues(newDataItemValues)
        return;
      }else{
        setSelectedDataItems([...selectedDataItems, item].sort());
        const newDataItemValues=[];
        var maxValue=null;
        var minValue=null;
        for(var i=0;i<activeSessionData.frames.length;i++){
          if(activeSessionData.frames[i].dataValues[item]==="") continue;
          if(activeSessionData.frames[i].dataValues[item]===" True"||activeSessionData.frames[i].dataValues[item]===" False"){
            if(maxValue===null){
              maxValue=1;
              minValue=0;
            }
            newDataItemValues.push({"frame":activeSessionData.frames[i].dataValues.frame,"value":activeSessionData.frames[i].dataValues[item]===" True"?1:0});
          }else{
            newDataItemValues.push({"frame":activeSessionData.frames[i].dataValues.frame,"value":activeSessionData.frames[i].dataValues[item]});
            if(maxValue===null || Number(maxValue)<Number(activeSessionData.frames[i].dataValues[item]))
              maxValue=activeSessionData.frames[i].dataValues[item];
            if(minValue===null || Number(minValue)>Number(activeSessionData.frames[i].dataValues[item]))
              minValue=activeSessionData.frames[i].dataValues[item];
          }
        }
        setSelectedDataItemsValues({...selectedDataItemsValues, [item]:{"values":newDataItemValues, "min":minValue, "max":maxValue}});
      };
    }
  };

  const obtainRawData = async (item) => {
    const url=process.env.REACT_APP_SESSIONS_URL+"/rawDataSession/loadSessionRawData?id="+item.id;
      const response = await fetch(url);
      if(!response.ok){
        return null;
      }
      const sessionData = await response.json();
      return sessionData;
  }

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
  };

  const handleGameChanged = (event) =>{
    setGame(event.target.value);
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
      Gestión de sesiones - Juan Pérez
    </div>
    <div className="app">
    <h1 class="main-title">Gestión de sesiones - Juan Pérez</h1>
    <h3 class="title">FILTROS</h3>
    <div class="rectangle">
      <div className="filters">
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
        <button className="button-search" onClick={loadSessions}>Buscar</button>
      </div>
    </div>
        {sessions.length>0?
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
                  {session.game+ ", "+session.date}
                  <label className="secondary-txt">{session.id}</label>
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
        :""}

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

    <div>
        {/* Sección Superior */}
        {selectedDataItems.map((dataItem, index) => (
          <Card className="tremor-Card">
            <h3>{dataItem}</h3>
            <AreaChart
            data={selectedDataItemsValues[dataItem].values}
            index="frame"
            categories={["value"]}
            onValueChange={(v) => console.log(v)}
            maxValue={Number(selectedDataItemsValues[dataItem].max)}
            minValue={Number(selectedDataItemsValues[dataItem].min)}
            xLabel="Frame"
            yLabel="Value"
            colors={getRandomColors(1,index)}
            showLegend={false}
            showXAxis={true}
          >
          </AreaChart>
        </Card>
        ))}       
      </div>
    {selectedSessions?.length>0?
    <div className="button-bar">
      {/*<button className="button-clean" onClick={handleOpenModal}>LIMPIAR SESIÓN</button>*/}
      <button className="button-export" onClick={exportDataToCsv}>EXPORTAR</button>
    </div>
    :null}
    </div>
    </>
  );
}

export default Raw_data;