"use client"
import React, { useState, useEffect } from "react";
import { AreaChart, BarChart, Card, Title } from "@tremor/react";
import { useNavigate, useLocation } from "react-router-dom";
import { ResponsiveContainer } from "recharts";
import { Tooltip } from "@mui/material";
import "../App.css"; // Archivo CSS separado

const Evolution = () => {
  const navigate=useNavigate();
  const [graphs, setGraphs]=useState(["bar","area","bar","bar"]);
  const [selectedGame, setSelectedGame] = useState(["","","",""]);
  const [selectedData, setSelectedData] = useState(["","","",""]);
  const [games, setGames] = useState([]);
  const [dataOptions, setDataOptions] = useState([[],[],[],[]]);
  const [graphData, setGraphData] = useState([
    { index:0, session: "1", date: "Ene", value: 10 },
    { index:0, session: "2", date: "Feb", value: 20 },
    { index:0, session: "3", date: "Mar", value: 30 },
    { index:1, session: "1", date: "Ene", value: 30 },
    { index:1, session: "2", date: "Feb", value: 20 },
    { index:1, session: "3", date: "Mar", value: 10 },
    { index:2, session: "1", date: "Ene", value: 10 },
    { index:2, session: "2", date: "Feb", value: 20 },
    { index:2, session: "3", date: "Mar", value: 50 },
    { index:3, session: "1", date: "Ene", value: 50 },
    { index:3, session: "2", date: "Feb", value: 20 },
    { index:3, session: "3", date: "Mar", value: 30 },
  ]);

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
        console.log(graphData);
    }
  
    // call the function
    fetchGames()
  }, []);

  const fetchCalculatedData = async (gameId, index) => {
    try{
        const response = await fetch("http://localhost:8081/calculatedData/loadCalculatedData?gameId="+gameId);
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

  const obtainDynamicCalculus = async (event,index) => {
    const optionToObtain=dataOptions[index].filter(data=>data.id===event.target.value).at(0);
    if(optionToObtain===null){
      alert("Algo ha ido mal.");
      return;
    }
    try{
      const parsedParam2=optionToObtain.parameter2?optionToObtain.parameter2:"a";
      const response = await fetch("http://localhost:9000/rawDataSession/calculateData?operation="+optionToObtain.operation+
        "&parameter1="+optionToObtain.parameter1+"&parameter2="+parsedParam2, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(optionToObtain.sessions),
      });
        if(!response.ok){
          alert("No pudieron cargarse los cálculos.");
          return;
        }
        // convert data to json
        const responseData = await response.json();
        const newGraphData = graphData.filter(graph => graph.index!=index);
        console.log(newGraphData);
        for(var i=0;i<optionToObtain.sessions.length;i++){
          await newGraphData.push({"index":index,"session":optionToObtain.sessions[i],"value":Math.round(responseData[optionToObtain.sessions[i]]*1000)/1000, "date":optionToObtain.session_dates[optionToObtain.sessions[i]].split('T')[0]});
        }
        console.log(newGraphData);
        setGraphData(newGraphData);
    }catch(error){
        alert("La web no funciona por el momento. Inténtelo más tarde.")
        console.log(error);
    }
  }

  const handleGameChanged = index => (event,value) =>{
    const newSelectedGame=[...selectedGame];
    newSelectedGame[index]=event.target.value;
    setSelectedGame(newSelectedGame);
    console.log(newSelectedGame);
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
    console.log(newSelectedData);
    if(event.target.value===""){
      setGraphData(graphData.filter(graph => graph.index!=index));
      return;
    }
    obtainDynamicCalculus(event,index);
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
    console.log(dataOptions[index].filter(option=>option.id===selectedData[index]));
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
    console.log(dataString);
  };

return (
<>
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
        {graphs.map((graph, index) => (
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
            fill="solid"
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
      </div>
      </div>
    </>
  );
};

export default Evolution;
