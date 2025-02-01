import React, { act, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { height } from '@mui/system';
import { Input } from 'postcss';

function Admin() {    
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [parameters, setParameters] = useState([]); 
  const [calculatedData, setCalculatedData] = useState([]);
  const [newParameterActivated, setNewParameterActivated] = useState([]);
  const [newCDataActivated, setNewCDataActivated] = useState([]);
  const [newGameActivated, setNewGameActivated] = useState(0);
  const [addValue, setAddValue] = useState("");

  // Lista de pacientes (solo incluye "Juan Pérez" como se indicó)
  const pacientes = ["Juan Pérez"];

  useEffect(() => {
    // Encuentra el contenedor de la lista por su id y desplázalo al final
    const listContainer = document.getElementById("scrollable-list");
    if (listContainer) {
      listContainer.scrollTop = listContainer.scrollHeight;
    }
  }, [newParameterActivated, newCDataActivated]);

  useEffect(() => {
    const fetchGames = async () => {
      try{
        const responseGames = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/loadGames");
        if(!responseGames.ok){
          setGames([]);
          alert("No pudieron cargarse los juegos para filtrar.");
          return;
        }
        // convert data to json
        const gamesParsed = await responseGames.json();
        setGames(gamesParsed);
        var newActivatedTemp=[];
        var calculatedDataTemp=[];
        var parametersTemp=[];
        for(var i=0;i<gamesParsed?.length;i++){
          newActivatedTemp.push({"id":gamesParsed[i].id,"value":0});
          const responseCalculatedData = await fetch(process.env.REACT_APP_GENERAL_URL+"/calculatedData/loadCalculatedData?gameId="+gamesParsed[i].id);
          if(responseCalculatedData.ok){
            const calculatedDataParse=await responseCalculatedData.json();
            calculatedDataTemp.push({"id":gamesParsed[i].id,"data":calculatedDataParse});
          }

          const responseParameters = await fetch(process.env.REACT_APP_GENERAL_URL+"/parameter/loadParameters?gameId="+gamesParsed[i].id);
          if(responseParameters.ok){
            const parameterParse=await responseParameters.json();
            parametersTemp.push({"id":gamesParsed[i].id,"data":parameterParse});
          }
        }
        setCalculatedData(calculatedDataTemp);
        setParameters(parametersTemp);
        setNewParameterActivated(newActivatedTemp);
        setNewCDataActivated(newActivatedTemp);
      }catch(error){
        alert("La web no funciona por el momento. Inténtelo más tarde.")
      }
    }
  
    // call the function
    fetchGames()
  }, []);

  const activateNewGamePanel = () =>{
    setNewGameActivated(1);
  }

  const activateNewParameterPanel = gameId => () => {
    var newParameterActivatedTemp=newParameterActivated.filter(p=>(p.id!==gameId));
    newParameterActivatedTemp.push({"id":gameId,"value":1});
    setNewParameterActivated(newParameterActivatedTemp);
  }

  const activateNewCalculatedDataPanel = gameId => () =>{
    var newCDataActivatedTemp=newParameterActivated.filter(p=>(p.id!==gameId));
    newCDataActivatedTemp.push({"id":gameId,"value":1});
    setNewCDataActivated(newCDataActivatedTemp);
  }

  const deactivateNewParameterPanel = gameId => () => {
    var newParameterActivatedTemp=newParameterActivated.filter(p=>(p.id!==gameId));
    newParameterActivatedTemp.push({"id":gameId,"value":0});
    setNewParameterActivated(newParameterActivatedTemp);
  }

  const deactivateNewCalculatedDataPanel = gameId => () => {
    var newCDataActivatedTemp=newParameterActivated.filter(p=>(p.id!==gameId));
    newCDataActivatedTemp.push({"id":gameId,"value":0});
    setNewCDataActivated(newCDataActivatedTemp);
  }

  const addParameter = (gameId, name) => async () => {
    const parametersTemp=parameters;
    if(parameters.filter(p=>p.id===gameId).length>0){
      if(name==="" || parameters.filter(p=>p.id===gameId)[0].data.filter(d=>d.name===name).length>0){
        alert("No se puede insertar el nuevo parámetro: el valor es repetido o no es válido. Pruebe con otro valor.");
        return;
      }
    }else{
      parametersTemp.push({"id":gameId,"data":[]});
    }
    const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/parameter/insertParameter", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ game: gameId, name: name }),
    });

    if(!response.ok){
      setGames([]);
      alert("No se pudo insertar el nuevo parámetro. Inténtelo más tarde.");
      return;
    }

    const responseData = await response.json();
    const newGameParameters=parametersTemp.filter(p=>p.id===gameId)[0];
    const newParameters=parametersTemp.filter(p=>p.id!==gameId);
    newGameParameters.data.push(responseData);
    newParameters.push(newGameParameters);
    setAddValue("");
    setParameters(newParameters);
  }

  const addGame = name => async () => {
    const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/insertGame", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name }),
    });

    if(!response.ok){
      setGames([]);
      alert("No se pudo insertar el nuevo juego. Inténtelo más tarde.");
      return;
    }

    const responseData = await response.json();
    setGames([... games, responseData]);
    setAddValue("");
    setNewGameActivated(0);
  }

  const deactivateNewGamePanel = () => {
    setNewGameActivated(0);
  }

  return (
  <>
    <div class="app">
    <h1>Panel de administración</h1>
    <hr className="linea-delimitadora" />
    Bienvenid@ al panel de administración. Este es un panel especial cuya función es gestionar los juegos y 
    <br/>
    operaciones disponibles para los terapeutas. Si un terapeuta necesita incorporar nuevas operaciones, aquí
    <br/>
    es donde se puede hacer. Este panel está en una versión temprana, por lo que se puede someter a cambios.
    <br/><br/>
    <button className="button-admin-game" onClick={activateNewGamePanel}>Nuevo juego</button>
    {newGameActivated===1?
      <div class="rectangle">
        <input placeholder="Escribe el nombre" value={addValue} onChange={(e) => setAddValue(e.target.value)}></input>
        <button className="button-admin-cancel" onClick={deactivateNewGamePanel}> Cancelar </button>
        <button className="button-admin-new" onClick={addGame(addValue)}> Añadir </button>
      </div>
    :""}
    {games.map((game, index) => (
    <>
    <h1>{game.name}</h1>
    <div className="admin-container">
      {/* Margen izquierdo */}
      <div className="admin-left">
          <div className="list-container">
          <h3>PARÁMETROS</h3>
            <div className="scrollable-list" id="scrollable-list">
            {parameters.filter(p=>p.id===game.id)[0]?.data.map((p, index) => (
              <div
                key={index}
                className={`list-item`}>
                {p.name}
              </div>
            ))}
            {newParameterActivated.filter(p=>p.id===game.id)[0]?.value===1?
              <div className={`list-item`}>
                <input placeholder="Escribe el nombre" value={addValue} onChange={(e) => setAddValue(e.target.value)}></input>
                <button className="button-admin-cancel" onClick={deactivateNewParameterPanel(game.id)}> Cancelar </button>
                <button className="button-admin-new" onClick={addParameter(game.id, addValue)}> Añadir </button>
              </div>
            :""}
          </div>
          <button className="button-admin-add" onClick={activateNewParameterPanel(game.id)}>+</button>
          </div>
        </div>

      {/* Margen derecho */}
      <div className="admin-right">
        <div className="list-container">
        <h3>CÁLCULOS</h3>
          <div className="scrollable-list">
          {calculatedData.filter(cData=>cData.id===game.id)[0]?.data.map((cData, index) => (
              <div
                key={index}
                className={`list-item`}>
                {cData.name}
              </div>
            ))}
          {newCDataActivated.filter(p=>p.id===game.id)[0]?.value===1?
          <>
              <div className={`list-item`}>
                <input placeholder="Escribe el nombre" value={addValue} onChange={(e) => setAddValue(e.target.value)}></input>
                <button className="button-admin-cancel" onClick={deactivateNewCalculatedDataPanel(game.id)}> Cancelar </button>
                <button className="button-admin-new" onClick={addParameter(game.id, addValue)}> Añadir </button>
                <div className={`list-item`}>
                  <select id="dropdown" className='date-input' value={game}>
                    <option value="">Selecciona una operación</option>
                    {games?.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              </>
            :""}
          </div>
        <button className="button-admin-add" onClick={activateNewCalculatedDataPanel(game.id)}>+</button>
        </div>
      </div>
    </div>
    </>
    ))}
    </div>
    </>
  );
 }

export default Admin;