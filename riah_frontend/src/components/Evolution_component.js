"use client"
import React, { useState, useEffect } from "react";
import { AreaChart, BarChart, Card, Title } from "@tremor/react";
import "../App.css"; // Archivo CSS separado
import { useNavigate, useLocation } from "react-router-dom";
import { isDisabled } from "@testing-library/user-event/dist/utils";

const UsuarioDetalle = () => {
  const navigate=useNavigate();
  const [selectedGraph, setSelectedGraph] = useState("G. Lineal");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [calculatedData, setCalculatedData] = useState([]);
  const [games, setGames] = useState([]);
  const [dataOptions, setDataOptions] = useState([]);
  const [graphData, setGraphData] = useState([
    { tiempo: "Ene", "m/s": 10 },
    { tiempo: "Feb", "m/s": 20 },
    { tiempo: "Mar", "m/s": 30 },
  ]);

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

  const fetchCalculatedData = async (gameId) => {
    try{
        const response = await fetch("http://localhost:8081/calculatedData/loadCalculatedData?gameId="+gameId);
        if(!response.ok){
          setDataOptions([]);
          setSelectedData("");
          alert("No pudieron cargarse los datos calculables.");
          return;
        }
        // convert data to json
        const responseData = await response.json();
        setDataOptions(responseData);
    }catch(error){
        alert("La web no funciona por el momento. Inténtelo más tarde.")
    }
  }

  const obtainDynamicCalculus = async () => {
    const optionToObtain=dataOptions.filter(data=>data.id===selectedData).at(0);
    if(optionToObtain===null){
      alert("Algo ha ido mal.");
      return;
    }
    try{
      console.log(optionToObtain.session_dates);
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
        await setGraphData([]);
        // convert data to json
        const responseData = await response.json();
        const graphSet = [];
        for(var i=0;i<optionToObtain.sessions.length;i++){
          await graphSet.push({"session":optionToObtain.sessions[i],"m/s":responseData[optionToObtain.sessions[i]], "tiempo":optionToObtain.session_dates[optionToObtain.sessions[i]].split('T')[0]});
        }
        await graphSet.sort((a,b) => {
          return a.tiempo <
              b.tiempo
      });
        setGraphData(graphSet);
    }catch(error){
        alert("La web no funciona por el momento. Inténtelo más tarde.")
        console.log(error);
    }
  }

  const handlePatientList = () => {
    navigate('/')
  }

  const handleGameChanged = (event) =>{
    const value=event.target.value
    setSelectedGame(value);
    if(value===""){
      setDataOptions([]);
      setSelectedData("");
      return;
    }
    fetchCalculatedData(event.target.value);
  }

  const handleDataOptionChanged = (event) =>{
    setSelectedData(event.target.value);
    console.log(event.target.value);
  }

  return (
    <>
    <div className="sub-banner">
      <button className="nav-button">Home</button> &gt; 
      <button className="nav-button">Mi portal</button> &gt; 
      <button className="nav-button" onClick={handlePatientList}>Listado de pacientes</button> &gt;
      Evolución - Juan Pérez
    </div>
    <div div class="app">
    <div className="usuario-detalle-container">
      {/* Título */}
      <h1>Evolución - Juan Pérez</h1>

      <div className="contenedor-secciones">
        {/* Sección Superior */}
          <Card className="tremor-Card">
            {selectedGraph === "G. Lineal" ? (
                <AreaChart
                className="h-80"
                data={graphData}
                index="tiempo"
                categories={["m/s"]}
                onValueChange={(v) => console.log(v)}
                valueFormatter={(number) =>
                    `${number.toString()}`
                  }
                xLabel="Time"
                yLabel="Velocity"
                fill="solid"
                showLegend={false}
                showXAxis={true}
              />
            ) : (
                <BarChart
                className="mt-12 hidden h-72 sm:block"
                data={graphData}
                index="tiempo"
                xLabel="Time"
                yLabel="Velocity"
                categories={['m/s']}
                showLegend={false}
                showXAxis={true}
              />  
            )}
          </Card>
        {/* Sección Inferior */}
        <div className="seccion-inferior">
          <div className="campo">
            <h3>JUEGO</h3>
            <select id="dropdown" value={selectedGame} className="dropdown" onChange={handleGameChanged}>
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
            <select id="dropdown" value={selectedData} className="dropdown" onChange={handleDataOptionChanged} disabled={selectedGame===""}>
                <option value="">Ninguno</option>
                    {dataOptions?.map((option, index) => (
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
              value={selectedGraph}
              onChange={(e) => setSelectedGraph(e.target.value)}
              disabled={selectedData===""}
            >
              <option value="G. Lineal">G. Lineal</option>
              <option value="G. Barras">G. Barras</option>
            </select>
          </div>
          <button className={`btn mostrar ${selectedData.length==0? "disabled":""}`} disabled={selectedData.length==0} onClick={obtainDynamicCalculus}>Calcular</button>
        </div>        
      </div>
    </div>
    </div>
    </>
  );
};

export default UsuarioDetalle;
