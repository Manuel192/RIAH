"use client"
import React, { useState, useEffect } from "react";
import { AreaChart, BarChart, Card} from "@tremor/react";
import { useNavigate, useLocation} from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import '../css/EvolutionComponent.css';
import "../App.css";

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

const Evolution = ({redirect}) => {
  const navigate=useNavigate();
  const location=useLocation();
  const {patient}=location.state || {};

  const [graphs, setGraphs]=useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedInitDate, setSelectedInitDate] = useState([]);
  const [selectedEndDate, setSelectedEndDate] = useState([]);
  const [implementationParameters, setImplementationParameters] = useState([]);
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
    const init = async () => {
        await redirect();
        try{
           const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/loadGames", {
                headers: {
                    'Authorization': 'Bearer '+sessionStorage.getItem("token"),
                },
              });
            if(!response.ok){
                setGames([]);
                alert("No pudieron cargarse los juegos para filtrar.");
                return;
            }
            const responseData = await response.json();
            setGames(responseData);
        }catch(error){
            alert(error)
        }
        
        var response = await fetch(process.env.REACT_APP_GENERAL_URL+'/record/loadRecord?patient='+patient.id,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
        var responseData = "";
        if(!response.ok){
          response= await fetch(process.env.REACT_APP_SESSIONS_URL+'/record/insertRecord',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          }})
          responseData=await response.text();
          const responseRecordRelations=await fetch(process.env.REACT_APP_GENERAL_URL+"/record/insertRecord?patient="+patient.id+"&dataID="+responseData,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          }})
        }else{
          responseData=await response.text();
        }
        const responseRecord =  await fetch(process.env.REACT_APP_SESSIONS_URL+'/record/loadRecord?id='+responseData,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
        const responseRecordData = await responseRecord.json();
        setRecordID(responseRecordData.id);
        const obtainedGraphs=responseRecordData.graphs;
        for(var i=0;i<obtainedGraphs.length;i++){
          selectedGame.push(obtainedGraphs[i].game || "");
          selectedData.push(obtainedGraphs[i].operation || "");
          selectedInitDate.push(obtainedGraphs[i].initDate || "");
          selectedEndDate.push(obtainedGraphs[i].endDate || "");
          graphs.push("area");
        }
        const responseImplementationParameters = await fetch(process.env.REACT_APP_GENERAL_URL+"/implementation/loadImplementationParameters",{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
        if(!responseImplementationParameters.ok){
          alert("Algo ha ido mal. Algunos datos no han cargado correctamente.");
          return;
        }
        const implementationParametersParsed = await responseImplementationParameters.json();
        setImplementationParameters(implementationParametersParsed);

        const obtainedDataOptions=await fetchAll(obtainedGraphs);
        const newGraphData=await calculateAll(obtainedGraphs, obtainedDataOptions,implementationParametersParsed);
        setGraphData(newGraphData);
        setIsLoading(false);
    }
  
    init()
  }, []);

  const addGraph = () => {
    setSelectedData([...selectedData, ""]);
    setSelectedGame([...selectedGame, ""]);
    setSelectedInitDate([...selectedInitDate, ""]);
    setSelectedEndDate([...selectedEndDate, ""]);
    setGraphs([...graphs, "area"]);
  }

  const fetchAll = async (obtainedGraphs) => {
    const newDataOptions=[...dataOptions];
    for(var i=0;i<obtainedGraphs.length;i++){
      const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/operation/loadOperations?gameId="+obtainedGraphs[i].game,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
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
  }

  const fetchCalculatedData = async (gameId, index) => {
    const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/operation/loadOperations?gameId="+gameId,{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
    if(!response.ok){
      const newDataOptions=[...dataOptions];
      newDataOptions[index]=[];
      setDataOptions(newDataOptions);
      const newSelectedData=[...selectedData];
      newSelectedData[index]="";
      setSelectedData(newSelectedData);
      return;
    }
    // convert data to json
    const responseData = await response.json();
    const newDataOptions=[...dataOptions];
    newDataOptions[index]=responseData;
    setDataOptions(newDataOptions);
  }

  const calculateAll = async (obtainedGraphs, obtainedDataOptions,implementationParametersParsed) => {
    var newGraphData = [];
    for(var i=0;i<obtainedGraphs.length;i++){
      const obtainedGraphData=await obtainDynamicCalculus(obtainedGraphs[i].operation,i,obtainedDataOptions,implementationParametersParsed);
      if(obtainedGraphData!=null){
        if(obtainedGraphData.length>0) newGraphData=[...newGraphData, ...obtainedGraphData];
        else newGraphData.push({"index":i,"session":"","value":0, "date":""});
      }
    }
    return newGraphData;
  }

  const obtainDynamicCalculus = async (dataId,index,obtainedDataOptions,implementationParametersParsed) => {
    const optionToObtain=obtainedDataOptions[index].filter(data=>data.id===dataId).at(0);
    try{
      const structuredImplementationParameters=implementationParametersParsed.filter(ip=>ip.operation===optionToObtain.id);
      const response = await fetch(process.env.REACT_APP_SESSIONS_URL+"/rawDataSession/calculateData?operation="+optionToObtain.operation, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
          body: JSON.stringify({"versions":optionToObtain.versions,"sessions":optionToObtain.sessions, "sessionVersions":optionToObtain.session_versions, "implementationParameters":structuredImplementationParameters}),
      });
      if(!response.ok){
        alert("La operación que está utilizando no es compatible con ninguna de sus sesiones actuales. Contacte con un administrador para corregirlo.")
      }
      const responseData = await response.json();
      const newGraphData = [];
      for(var i=0;i<Object.keys(responseData).length;i++){
        const idSession=Object.keys(responseData)[i];
        await newGraphData.push({"index":index,"session":idSession,
        "value":Math.round(responseData[idSession]*1000)/1000, "date":optionToObtain.session_dates[idSession].split('T')[0]});
      }
      return newGraphData;
    }catch(error){
      return [];
    }
  }

  const handleGameChanged = index => (event,value) =>{
    const newSelectedGame=[...selectedGame];
    newSelectedGame[index]=event.target.value || "";
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
    newSelectedData[index]=event.target.value || "";
    setSelectedData(newSelectedData);
    updateRecord(newSelectedData[index], newSelectedData[index], selectedInitDate[index], selectedEndDate[index], index);

    const obtainedGraphData=await obtainDynamicCalculus(event.target.value,index,dataOptions);
    var newGraphData=graphData.filter(graph => graph.index!=index);
    if(obtainedGraphData!=null)
      newGraphData=[... newGraphData, ...obtainedGraphData];
    setGraphData(newGraphData);
  }

  const handleGraphChanged = index => async (event,value) =>{
    const newGraphs=[...graphs];
    newGraphs[index]=event.target.value || "";
    setGraphs(newGraphs);
  }

  const handleInitDate = index => async (event, value) =>{
    const newSelectedInitDate=[...selectedInitDate];
    newSelectedInitDate[index]=event.target.value || "";
    setSelectedInitDate(newSelectedInitDate);
    updateRecord(newSelectedInitDate[index], selectedData[index], newSelectedInitDate[index], selectedEndDate[index], index);
  }

  const handleEndDate = index => async (event) =>{
    const newSelectedEndDate=[...selectedEndDate];
    newSelectedEndDate[index]=event.target.value || "";
    setSelectedEndDate(newSelectedEndDate);
    updateRecord(newSelectedEndDate[index], selectedData[index], selectedInitDate[index], newSelectedEndDate[index], index);
  }

  const updateRecord = async (newValue, newData, newInitDate, newEndDate, index) => {
    var data=[];
    for(var i=0;i<selectedGame.length;i++){
      if(i===index)
        data.push({"game":selectedGame[i] || "","operation":newData || "","initDate":newInitDate || "","endDate":newEndDate || ""});
      else
        data.push({"game":selectedGame[i] || "","operation":selectedData[i] || "","initDate":selectedInitDate[i] || "","endDate":selectedEndDate[i] || ""});
    }

    if(newData===""){
      setGraphData(graphData.filter(graph => graph.index!=index));
    }
    
    const responseCheck = await fetch(process.env.REACT_APP_SESSIONS_URL+'/record/updateRecord', {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
      },
      body: JSON.stringify({ id: recordID, data: data }),
    });

    if(!responseCheck.ok){
      alert("Algo ha ido mal al actualizar la configuración.");
      return;
    }
  }

  const handlePatientList = () => {
    navigate('/therapist/patients-list')
  }

  const handleHomePanel = () => {
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
  <div className="sub-banner">
      <button className="nav-button" onClick={handleHomePanel}>Home</button> &gt; 
      <button className="nav-button" onClick={handlePatientList}>Listado de pacientes</button> &gt;
    Evolución - {patient.name}
  </div>
  <div div class="app">
  <div className="evolution-container">
    <h1 class="main-title">Evolución - {patient.name}</h1>
    <div class="graphs">
      {graphs?.map((graph, index) => (
        <Card className="tremor-Card">
        <div className="inferior-container">
        <div className="field">
        <LoadingScreen isLoading={isLoading} text={"Cargando gráfica..."} isFixed={false} />
          <h3 class="title">{dataOptions[index]?.filter(option=>option.id===selectedData[index])[0]?.name || "Sin nombre"}</h3>
          <label style={{fontWeight: "bold"}}>JUEGO</label>
          <select id="dropdown" value={selectedGame[index]} className="dropdown" onChange={handleGameChanged(index)}>
            <option value="" disabled="true">Ninguno</option>
              {games?.map((option, index) => (
                <option key={index} value={option.id}>
                {option.name}
                </option>
              ))}
          </select>
        </div>

        <div className="field">
        <label style={{fontWeight: "bold"}}>DATO</label>
          <select id="dropdown" value={selectedData[index]} className="dropdown" onChange={handleDataOptionChanged(index)} disabled={selectedGame[index]===""}>
              <option value="">Ninguno</option>
                  {dataOptions[index]?.map((option, index) => (
                      <option key={index} value={option.id}>
                      {option.name}
                      </option>
                  ))}
              </select>
        </div>

        <div className="field">
        <label style={{fontWeight: "bold"}}>GRÁFICO</label>
          <select className="dropdown" value={graphs[index]} onChange={handleGraphChanged(index)} disabled={selectedData[index]===""}>
            <option value="area">G. Lineal</option>
            <option value="bar">G. Barras</option>
          </select>
        </div>
        </div>
        {graph==="area"?(
          <AreaChart
          data={graphData.filter(graph=>graph.index===index&&(selectedInitDate[index].length<1 || selectedInitDate[index]<=graph.date)&&(selectedEndDate[index].length<1 || selectedEndDate[index]>=graph.date) || {})}
          index="date"
          categories={["value"]}
          onValueChange={(v) => console.log(v)}
          valueFormatter={(value, index) => `${value}`}
          colors={getRandomColors(1,index)}
          showLegend={false}
          showXAxis={true}
        >
        </AreaChart>
        ):""}
        {graph==="bar"?(
          <BarChart
          data={graphData.filter(graph=>graph.index===index&&(selectedInitDate[index].length<1 || selectedInitDate[index]<=graph.date)&&(selectedEndDate[index].length<1 || selectedEndDate[index]>=graph.date)  || {})}
          index="date"
          categories={['value']}
          colors={getRandomColors(1,index)}
          valueFormatter={(value, index) => `${value}`}
          showLegend={false}
          showXAxis={true}
          >
        </BarChart>
        ):""}
        <div class="date-filter">
          <div className="date-field">
          <label style={{fontWeight: "bold"}}>INICIO</label>
            <input 
              type="date" 
              value={selectedInitDate[index]}
              onChange={handleInitDate(index)}
              className="raw-data-input" 
            />
          </div>
          <div className="date-field">
          <label style={{fontWeight: "bold"}}>FIN</label>
            <input 
              type="date" 
              value={selectedEndDate[index]}
              onChange={handleEndDate(index)}
              className="raw-data-input" 
            />
          </div>
        </div>
          <button className='button-export-evolution' onClick={()=>exportDataToCsv(index)}>Exportar datos</button>
      </Card>
      ))}       
    </div>
    <button className="button-new-graph" onClick={addGraph}>Nueva gráfica</button>
    </div>
    </div>
  </>
  );
};

export default Evolution;
