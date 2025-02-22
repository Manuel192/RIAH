"use client"
import React, { useState, useEffect } from "react";
import { AreaChart, BarChart, Card, Title } from "@tremor/react";
import { useNavigate, useLocation } from "react-router-dom";
import { ResponsiveContainer } from "recharts";
import { Tooltip } from "@mui/material";
import LoadingScreen from "./loadingScreen"; // Importamos el componente de carga
import "../App.css"; // Archivo CSS separado

const getRandomColors = (numColors, index) => {
  const tremorColors = [
    "blue", "sky", "cyan", "teal", "green", "lime",
    "yellow", "amber", "orange", "red", "rose", "pink",
    "fuchsia", "purple", "violet", "indigo", "gray", "stone"
  ];
  return Array.from({ length: numColors }, () =>
    tremorColors[index]
  );
};

const Evolution = () => {
  const navigate=useNavigate();
  const [graphs, setGraphs]=useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [games, setGames] = useState([]);
  const [dataOptions, setDataOptions] = useState([[],[],[],[]]);
  const [recordID,setRecordID] = useState({});
  const [graphData, setGraphData] = useState([]);

  const CustomTooltip = ({ index }) => {
    const dataPoint = graphData[index];
    return (
      <div className="custom-tooltip">
        <p><strong>ID:</strong> {dataPoint.session}</p>
        <p><strong>Fecha:</strong> {dataPoint.date}</p>
        <p><strong>Velocidad:</strong> {dataPoint.value}</p>
      </div>
    );
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
            alert(error)
        }
        const response = await fetch(process.env.REACT_APP_SESSIONS_URL+'/record/loadRecord');
        if(!response.ok){
          setSelectedData(["","","",""]);
          setSelectedGame(["","","",""]);
          return;
        }
        // convert data to json
        const responseData = await response.json();
        setRecordID(responseData.id);
        const obtainedGraphs=responseData.graphs;
        console.log(responseData.graphs);
        for(var i=0;i<obtainedGraphs.length;i++)
          selectedGame.push(obtainedGraphs[i].game);
        for(var i=0;i<obtainedGraphs.length;i++)
          graphs.push("area");
        const obtainedDataOptions=await fetchAll(obtainedGraphs);
        for(var i=0;i<obtainedGraphs.length;i++)
          selectedData.push(obtainedGraphs[i].calculatedData);
        const newGraphData=await calculateAll(obtainedGraphs, obtainedDataOptions);
        setGraphData(newGraphData);
        setIsLoading(false);
    }
  
    // call the function
    fetchGames()
  }, []);

  const addGraph = () => {
    setSelectedData([... selectedData, ""]);
    setSelectedGame([... selectedGame, ""]);
    setGraphs([... graphs, "area"]);
  }

  const fetchAll = async (obtainedGraphs) => {
    try{
      const newDataOptions=[...dataOptions];
      for(var i=0;i<obtainedGraphs.length;i++){
        const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/calculatedData/loadCalculatedData?gameId="+obtainedGraphs[i].game);
        if(!response.ok){
          newDataOptions[i]=[];
          setDataOptions(newDataOptions);
          const newSelectedData=[...selectedData];
          newSelectedData[i]="";
          setSelectedData(newSelectedData);
          continue;
        }
        // convert data to json
        const responseData = await response.json();
        newDataOptions[i]=responseData;
      }
      setDataOptions(newDataOptions);
      return newDataOptions;
    }catch(error){
        alert("La web no funciona por el momento. Inténtelo más tarde.")
    }
  }

  const fetchCalculatedData = async (gameId, index) => {
    try{
        const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/calculatedData/loadCalculatedData?gameId="+gameId);
        if(!response.ok){
          const newDataOptions=[...dataOptions];
          newDataOptions[index]=[];
          setDataOptions(newDataOptions);
          const newSelectedData=[...selectedData];
          newSelectedData[index]="";
          setSelectedData(newSelectedData);
          alert("No existen datos calculables para este juego o no cargaron correctamente.");
          return;
        }
        // convert data to json
        const responseData = await response.json();
        const newDataOptions=[...dataOptions];
        newDataOptions[index]=responseData;
        setDataOptions(newDataOptions);
    }catch(error){
        alert("La web no funciona por el momento. Inténtelo más tarde.")
    }
  }

  const calculateAll = async (obtainedGraphs, obtainedDataOptions) => {
    var newGraphData = [];
    for(var i=0;i<obtainedGraphs.length;i++){
      const obtainedGraphData=await obtainDynamicCalculus(obtainedGraphs[i].calculatedData,i,obtainedDataOptions);
      if(obtainedGraphData.length>0) newGraphData=[... newGraphData, ... obtainedGraphData];
      else newGraphData.push({"index":i,"session":"","value":0, "date":""});
    }
    return newGraphData;
  }

  const obtainDynamicCalculus = async (dataId,index,obtainedDataOptions) => {
    const optionToObtain=obtainedDataOptions[index].filter(data=>data.id===dataId).at(0);
    try{ 
      const response = await fetch(process.env.REACT_APP_SESSIONS_URL+"/rawDataSession/calculateData?operation="+optionToObtain.operation, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({"sessions":optionToObtain.sessions,"parameters":optionToObtain.parameters}),
      });
      if(!response.ok){
        alert("No existen datos calculables para este juego o no cargaron correctamente.");
        return;
      }
      const responseData = await response.json();
      const newGraphData = [];
      for(var i=0;i<optionToObtain.sessions.length;i++){
        await newGraphData.push({"index":index,"session":optionToObtain.sessions[i],
        "value":Math.round(responseData[optionToObtain.sessions[i]]*1000)/1000, "date":optionToObtain.session_dates[optionToObtain.sessions[i]].split('T')[0]});
      }
      return newGraphData;
    }catch(error){
        alert("La web no funciona por el momento. Inténtelo más tarde.");
        return [];
    }
  }

  const handleGameChanged = index => (event,value) =>{
    const newSelectedGame=[...selectedGame];
    newSelectedGame[index]=event.target.value;
    setSelectedGame(newSelectedGame);
    if(value===""){
      setDataOptions([]);
      const newSelectedData=[...selectedData];
      newSelectedData[index]="";
      setSelectedData(newSelectedData);
      return;
    }
    fetchCalculatedData(event.target.value, index);
  }

  const handleDataOptionChanged = index => async (event,value) =>{
    const newSelectedData=[...selectedData];
    newSelectedData[index]=event.target.value;
    setSelectedData(newSelectedData);

    var data=[];
    for(var i=0;i<selectedGame.length;i++){
      data.push({"game":selectedGame[i],"calculatedData":newSelectedData[i]});
    }

    if(event.target.value===""){
      setGraphData(graphData.filter(graph => graph.index!=index));
      return;
    }

    const responseCheck = await fetch(process.env.REACT_APP_SESSIONS_URL+'/record/updateRecord', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: recordID, data: data }),
    });

    if(!responseCheck.ok){
      alert("Algo ha ido mal al actualizar la configuración.");
      return;
    }

    const obtainedGraphData=await obtainDynamicCalculus(event.target.value,index,dataOptions);
    var newGraphData=graphData.filter(graph => graph.index!=index);
    newGraphData=[... newGraphData, ...obtainedGraphData];
    setGraphData(newGraphData);
  }

  const handleGraphChanged = index => async (event,value) =>{
    const newGraphs=[...graphs];
    newGraphs[index]=event.target.value;
    setGraphs(newGraphs);
  }
  const handlePatientList = () => {
    navigate('/patients-list')
  }

  const handleUserPanel = () => {
  navigate('/')
  }

  const exportDataToCsv = (index) => {
    const dataName=dataOptions[index].filter(option=>option.id===selectedData[index])[0].name;
    const gameName=games.filter(option=>option.id===selectedGame[index])[0].name;
    const title=gameName+"_"+dataName;
    var dataString = "Date;Session;"+dataName;
    if(selectedData[index]===""){
      alert("Error al exportar: no se han seleccionado parámetros.");
      return;
    }
    var data=graphData.filter(graph=>graph.index===index);
    for(var i=0;i<data.length;i++){
      dataString+="\n"+data[i].date+";"+data[i].session+";"+data[i].value;
    }
    const blob = new Blob([dataString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

return (
  <>
  {/* Pantalla de carga */}
  <LoadingScreen isLoading={isLoading} />

  <div className="sub-banner">
      <button className="nav-button">Home</button> &gt; 
      <button className="nav-button" onClick={handleUserPanel}>Mi panel</button> &gt; 
      <button className="nav-button" onClick={handlePatientList}>Listado de pacientes</button> &gt;
    Evolución - Juan Pérez
  </div>
  <div div class="app">
  <div className="usuario-detalle-container">
    {/* Título */}
    <h1>Evolución - Juan Pérez</h1>
    <div class="graphs">
      {/* Sección Superior */}
      {graphs?.map((graph, index) => (
        <Card className="tremor-Card">
        <div className="seccion-inferior">
        <div className="campo">
          <h3>JUEGO</h3>
          <select id="dropdown" value={selectedGame[index]} className="dropdown" onChange={handleGameChanged(index)}>
              <option value="">Ninguno</option>
                  {games?.map((option, index) => (
                      <option key={index} value={option.id}>
                      {option.name}
                      </option>
                  ))}
              </select>
        </div>

        <div className="campo">
          <h3>DATO</h3>
          <select id="dropdown" value={selectedData[index]} className="dropdown" onChange={handleDataOptionChanged(index)} disabled={selectedGame[index]===""}>
              <option value="">Ninguno</option>
                  {dataOptions[index]?.map((option, index) => (
                      <option key={index} value={option.id}>
                      {option.name}
                      </option>
                  ))}
              </select>
        </div>

        <div className="campo">
          <h3>GRÁFICO</h3>
          <select 
            className="dropdown"
            value={graphs[index]}
            onChange={handleGraphChanged(index)}
            disabled={selectedData[index]===""}
          >
            <option value="area">G. Lineal</option>
            <option value="bar">G. Barras</option>
          </select>
        </div>
      </div> 
        {graph==="area"?(
          <AreaChart
          data={graphData.filter(graph=>graph.index==index)}
          index="date"
          categories={["value"]}
          onValueChange={(v) => console.log(v)}
          xLabel="Time"
          valueFormatter={(value, index) => `${value}m/s`}
          yLabel="Velocity"
          colors={getRandomColors(1,index)}
          showLegend={false}
          showXAxis={true}
          tooltip={({ index }) => <CustomTooltip index={index} />}
        >
        </AreaChart>
        ):""}
        {graph==="bar"?(
          <BarChart
              data={graphData.filter(graph=>graph.index==index)}
              index="date"
              xLabel="Time"
              yLabel="Velocity"
              categories={['value']}
              colors={getRandomColors(1,index)}
              valueFormatter={(value, index) => `${value}m/s`}
              showLegend={false}
              showXAxis={true}
              tooltip={({ index }) => <CustomTooltip index={index} />}
              >
            </BarChart>
        ):""}
          <button className='btn mostrar' onClick={()=>exportDataToCsv(index)}>Exportar</button>
      </Card>
      ))}       
    </div>
    <button className="button-admin-game" onClick={addGraph}>Nueva gráfica</button>
    </div>
    </div>
  </>
  );
};

export default Evolution;
