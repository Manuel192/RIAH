import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AreaChart, BarChart, Card, Title } from "@tremor/react";
import VideoPlayer from './video_player';
import Tabs from './Tabs_component';
import '../css/Raw_data_component.css';
import '../App.css';
import PointsScene from  './3DPointsScene';

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

function Raw_data({redirect}) {
  const tremorColors = [
    "blue", "sky", "cyan", "teal", "green", "lime",
    "yellow", "amber", "orange", "red", "rose", "pink",
    "fuchsia", "purple", "violet", "indigo", "gray", "stone"
  ];

  const navigate=useNavigate();
  const location=useLocation();
  const {patient}=location.state;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [games, setGames] = useState([]);
  const [game, setGame] = useState("");

  const [selectedDataItems, setSelectedDataItems] = useState([]);
  const [selectedDataItemsIndex, setSelectedDataItemsIndex] = useState([]);
  const [selectedDataItemsValues, setSelectedDataItemsValues] = useState([]);

  const [commonGraphDataItems, setCommonGraphDataItems] = useState([]);
  const [commonGraphMax, setCommonGraphMax] = useState([]);
  const [commonGraphMin, setCommonGraphMin] = useState([]);

  const [tabs, setTabs] = useState([]);

  // Whole sessions data
  const [sessions, setSessions] = useState([]);
  // Data items names
  const [dataItems,setDataItems] = useState([]);

  // Video data
  const [videoSource, setVideoSource] = useState();

  // Selected session properties (video, data reference, others).
  const [activeSession, setactiveSession] = useState();
  
  // Selected session data types and frames
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
    link.download = activeSession.game+"_"+activeSession.date.substring(0,10);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const init = async () => {
        await redirect();
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
  
    init()
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
      const url=process.env.REACT_APP_GENERAL_URL+"/session/loadFilteredSessions?firstDate="+stDate+"&lastDate="+lDate+"&gameId="+gameId+"&patientId="+patient.id;
      const response = await fetch(url);
      const sessionData = await response.json();
      if(sessionData.length<1){
        setSessions([]);
        setactiveSession();
        setDataItems();
        setTabs();
        alert("El paciente no ha realizado sesiones que cumplan con el filtro establecido.");
        return;
      }
      setSessions(sessionData);
      const item = sessionData[0];
      handleTabChange(item?.game+", "+item?.date, sessionData);
      setTabs(sessionData.map(s=>s.game+", "+s.date));
    }catch(error){
      alert("La web no funciona por el momento. Inténtelo más tarde.")
      setSessions([]);
      setactiveSession();
      setDataItems();
      setTabs();
      return;
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

  const toggleSelection = async (item) => {
      if(selectedDataItems.includes(item)){
        setSelectedDataItems(selectedDataItems.filter(i => i !== item));
        const newDataItemValues={...selectedDataItemsValues}
        delete newDataItemValues[item];
        setSelectedDataItemsValues(newDataItemValues)
        return;
      }else{
        setSelectedDataItems([...selectedDataItems, item].sort());
        var newSelectedDataItemsIndex=selectedDataItemsIndex.filter(i=>i.name!=item);
        newSelectedDataItemsIndex.push({name:item,value:"Frame"});
        setSelectedDataItemsIndex(newSelectedDataItemsIndex);
        obtainFrames([item], activeSessionData);
      };
    }

  const obtainFrames = (items, sessionData) => {
    var newSelectedDataItemsValues=selectedDataItemsValues;
    for(var j=0;j<items.length;j++){
      const newDataItemValues=[];
      var maxValue=null;
      var minValue=null;
      for(var i=0;i<sessionData.frames.length;i++){
        if(isNaN(sessionData.frames[i].dataValues[items[j]]))
          newDataItemValues.push({"value":0});
        else if(sessionData.frames[i].dataValues[items[j]].trim()==="True"||sessionData.frames[i].dataValues[items[j]].trim()==="False"){
          if(maxValue===null){
            maxValue=1;
            minValue=0;
          }
          newDataItemValues.push({"value":sessionData.frames[i].dataValues[items[j]].trim()==="True"?1:0});
        }else{
          newDataItemValues.push({"value":sessionData.frames[i].dataValues[items[j]]});
          if(!maxValue || Number(maxValue)<Number(sessionData.frames[i].dataValues[items[j]]))
            maxValue=sessionData.frames[i].dataValues[items[j]];
          if(!minValue || Number(minValue)>Number(sessionData.frames[i].dataValues[items[j]]))
            minValue=sessionData.frames[i].dataValues[items[j]];
        }
      }
      newSelectedDataItemsValues={...newSelectedDataItemsValues, [items[j]]:{"values":newDataItemValues, "min":minValue, "max":maxValue}};
    }
    setSelectedDataItemsValues(newSelectedDataItemsValues);
  }

  const obtainRawData = async (item) => {
    const url=process.env.REACT_APP_SESSIONS_URL+"/rawDataSession/loadSessionRawData?id="+item.data_id;
      const response = await fetch(url);
      if(!response.ok){
        return null;
      }
      const sessionData = await response.json();
      return sessionData;
  }

  const handleTabChange = async (index, currentSessions) => {
    if(index!==activeSessionData?.game+", "+activeSessionData?.date){
      const item = currentSessions.filter(i => index ===i.game+", "+i.date)[0];
      const sessionData=await obtainRawData(item);
      if(!sessionData){
        alert("No hay datos para esta sesión.");
        return;
      }
      const newDataItems=sessionData.dataTypes.filter
      (dataItem=>!(sessionData.frames[0].dataValues[dataItem].trim().length<1 || sessionData.frames[0].dataValues[dataItem].trim().isNaN));
      setDataItems(newDataItems);
      setactiveSession(item);
      setactiveSessionData(sessionData);
      obtainFrames(selectedDataItems,sessionData);
      const newVideo=process.env.REACT_APP_SESSIONS_URL+"/video/loadVideo?id="+item.video_id;
      setVideoSource(newVideo);
      const sessionVideo=document.getElementById("sessionVideo");
      sessionVideo.load();
    }
  };

  const handleGameChanged = (event) =>{
    setGame(event.target.value);
  }

  const handlePatientList = () => {
    navigate('/user/patients-list')
  }

  const handleHomePanel = () => {
    navigate('/')
  }

  const handleCommonGraphChanged = (event,index) => {
    var newDataItems=[...commonGraphDataItems];
    if(event.target.value===""){
      newDataItems=commonGraphDataItems.filter(i=>i!==commonGraphDataItems[index]);
      setCommonGraphDataItems([...newDataItems]);
    }else{
      newDataItems[index]=event.target.value;
      setCommonGraphDataItems([...newDataItems]);
    }
    var currentMax=null;
    var currentMin=null;
    for(var i=0;i<newDataItems.length;i++){
      if(!selectedDataItemsValues[newDataItems[i]]) continue;
      if(!currentMax || Number(selectedDataItemsValues[newDataItems[i]].max)>Number(currentMax))
          currentMax=selectedDataItemsValues[newDataItems[i]].max;
      if(!currentMin || Number(selectedDataItemsValues[newDataItems[i]].min)<Number(currentMin))
        currentMin=selectedDataItemsValues[newDataItems[i]].min;
    }
    setCommonGraphMax(currentMax);
    setCommonGraphMin(currentMin);
  }

  const addCommonGraphDataItem = () => {
    setCommonGraphDataItems([...commonGraphDataItems, ""]);
  }

  return (
  <>
    <div className="sub-banner">
        <button className="nav-button" onClick={handleHomePanel}>Home</button> &gt; 
        <button className="nav-button" onClick={handlePatientList}>Listado de pacientes</button> &gt;
      Gestión de sesiones - {patient.name}
    </div>
    <div className="app">
      <h1 class="main-title">Gestión de sesiones - {patient.name}</h1>
      <div class="rectangle">
        <div className="filters">
          <div className="date-field">
            <span>Fecha mínima</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => handleSetStartDate(e.target.value)} 
              className="raw-data-input" 
            />
          </div>
          <div className="date-field">
            <span>Fecha máxima</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => handleSetEndDate(e.target.value)} 
              className="raw-data-input" 
            />
          </div>
          <div className="date-field">
            <span>Juego serio</span>
            <select id="dropdown" className="raw-data-input" value={game} onChange={handleGameChanged}>
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
          <div className="list-sections">
            {dataItems?.length>0 && (
            <div className="list-container sticky-data">
              <div className="scrollable-list" style={{height: "100%"}}>
                {selectedDataItems.length>0&&(
                  <button className="button-export" onClick={exportDataToCsv} disabled={selectedDataItems.length<1}>Exportar datos seleccionados</button>
                )}
                {dataItems?.sort().map((data, index) => (
                  <div
                    key={index}
                    className={`list-item ${selectedDataItems.includes(data) ? "selected" : ""}`}
                    onClick={() => toggleSelection(data)}
                  >
                    {data}
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
            {activeSessionData.frames===undefined || !activeSession?
              (<div class="rectangle" style={{width: "100%"}}>
                <h1 class="main-title">Selecciona una sesión</h1>
              </div>):(

              <div class="rectangle" style={{width: "100%"}}>
                <h1 class="main-title">Sesión {activeSession.id}</h1>
                <h3 class="title">Información general</h3>
                <label class="session-info">Juego: {activeSession.game}</label>
                <br></br>
                <label class="session-info">Fecha: {activeSession.date.substring(0,10)}</label>
                <br></br>
                <label class="session-info">Hora: {activeSession.date.substring(11,19)}</label>
                <br></br>
                <label class="session-info">Autor: {patient.name}</label>
                <br></br>
                <br></br>
                <h3 class="title">Vídeo resumen</h3>
                {videoSource && (
                  <div style={{justifyItems: "center"}}>
                    <video id="sessionVideo" width="900" height="500" controls>
                      <source src={videoSource} type="video/mp4"/>
                    </video>
                  </div>
                )}

                <h3 class="title">Gráfica 3D</h3>
                <PointsScene dataItems={dataItems} activeSessionData={activeSessionData}></PointsScene>

                <div>
                <h3 class="title">Gráficas individuales</h3>
                {selectedDataItems?.map((dataItem, index) => (
                  <Card className="tremor-Card">
                    <h3 class="title">{dataItem}</h3>
                    <AreaChart
                      data={activeSessionData.frames.map(frame=>(frame.dataValues))}
                      index="Frame"
                      categories={[dataItem]}
                      maxValue={Number(selectedDataItemsValues[dataItem].max)}
                      minValue={Number(selectedDataItemsValues[dataItem].min)}
                      xLabel="Frame"
                      yLabel="Value"
                      colors={getRandomColors(1,index)}
                      showLegend={false}
                      showXAxis={true}
                    />
                </Card>
              ))}
              </div>

              {isModalOpen && <Modal onClose={handleCloseModal} onConfirm={handleConfirm} />}
              
              <Tabs tabs={tabs} onTabChange={(i)=>handleTabChange(i,sessions)} />
              {selectedDataItems.length>0 && (
              <div className="tremor-card-full-width">
                <h3 class="title">Comparación</h3>
                <div class="add-parameters-section">
                  {commonGraphDataItems.map((c,index)=>(
                    <select id="dropdown" value={c} className='input-parameter' onChange={(e)=>handleCommonGraphChanged(e,index)}>
                      <option value="">{"Parámetro "+(index+1)}</option>
                      {selectedDataItems.filter(d=>!commonGraphDataItems.includes(d) || d==c).map((dataItem, index) => (
                        <option key={index} value={dataItem}>
                          {dataItem}
                        </option>
                      ))}
                    </select>
                  ))}
                  <button class="button-search" onClick={()=>addCommonGraphDataItem()}>
                    + Añadir parámetro
                  </button>
                </div>
                <Card>
                  <AreaChart
                    data={activeSessionData.frames.map(frame=>(frame.dataValues))}
                    index="Frame"
                    categories={commonGraphDataItems}
                    xLabel="Frame"
                    yLabel="Value"
                    maxValue={Number(commonGraphMax)}
                    minValue={Number(commonGraphMin)}
                    colors={tremorColors}
                    showLegend={false}
                    showXAxis={true}
                  />
                </Card>
              </div>
              )}

          <h3 class="title">Tabla de datos</h3>
              {selectedDataItems.length>0 &&
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
                          selectedDataItems.includes(data) &&
                          <td key={colIndex}>{row.dataValues[data] || ""}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div> 
            }
            </div>
            )}
          <div style={{height: "200px"}}></div>
      </div>
    </>
  );
}

export default Raw_data;