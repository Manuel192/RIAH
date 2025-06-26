import React, { act, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Admin_component.css';
import '../App.css';

function Modal_Python({ onClose, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal modal-python">
        <h3>FORMATO PYTHON</h3>
        <p>El fichero Python recibe una o varias listas como input que representan los datos de los parámetros de una operación. Aparecen en el siguiente formato:</p>
        <br></br>
        <p>A,B,C,D,E,F,G</p>
        <br></br>
        <p>H,I,J,K,L,M,N</p>
        <br></br>
        <p>El código debe retornar un valor numérico resultado de tratar los datos enviados. Aquí tienes un ejemplo de referencia para calcular la media de la resta de dos parámetros:</p>
        <br></br>
        <img src={require('../media/RIAH_Python.png')} alt="Profile"/>

      </div>
    </div>
  );
}

function Admin() {    
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [parameters, setParameters] = useState([]); 
  const [calculatedData, setCalculatedData] = useState([]);
  const [newParameterActivated, setNewParameterActivated] = useState([]);
  const [newCDataActivated, setNewCDataActivated] = useState([]);
  const [newGameActivated, setNewGameActivated] = useState(0);
  const [newOperationActivated, setNewOperationActivated] = useState(0);
  const [addValue, setAddValue] = useState("");

  const [operations, setOperations] = useState([]);
  const [selectedOperation, setSelectedOperation] = useState();
  const [cDataParameters, setCDataParameters] = useState ([]);
  const [addNoParameters, setAddNoParameters] = useState();
  const [importedFileName, setImportedFileName] = useState("");
  const [importedData, setImportedData] = useState(null);
  const pacientes = ["John Doe"];

  useEffect(() => {
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
          alert("No pudieron cargarse los juegos.");
          return;
        }
        // convert data to json
        const gamesParsed = await responseGames.json();
        setGames(gamesParsed);
        const responseOperations = await fetch(process.env.REACT_APP_GENERAL_URL+"/operation/loadOperations");
        if(!responseOperations.ok){
          setOperations([]);
          alert("No pudieron cargarse las operaciones.");
          return;
        }
        // convert data to json
        const operationsParsed = await responseOperations.json();
        setOperations(operationsParsed);

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

  const handleImportPython = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content=e.target.result;
          setImportedData(content);
          setImportedFileName(file.name);
        } catch (error) {
          alert("Error al importar el archivo Python.", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const activateNewGamePanel = () =>{
    setNewGameActivated(1);
  }

  const activateNewOperationPanel = () =>{
    setNewOperationActivated(1);
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

  const addCData = (gameId) => async () => {
    const cDataTemp=calculatedData;
    if(addValue==="" || selectedOperation ==="" || cDataParameters.length<1 || cDataParameters.filter(param => param === "").length>0){
      alert("No se puede insertar el nuevo cálculo. Asegúrese de haber rellenado los campos correctamente.");
      return;
    }
    const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/calculatedData/insertCalculatedData", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ game: gameId, name: addValue, operation: selectedOperation, parameters: cDataParameters }),
    });
 
    if(!response.ok){
      alert("No se pudo insertar el nuevo cálculo. Asegúrese de haber rellenado los campos correctamente.");
      return;
    }
    const responseData = await response.json();
    console.log(cDataTemp);
    const newGameCalculatedData=cDataTemp.filter(p=>p.id===gameId)[0] || {id: gameId, data: []};
    console.log(newGameCalculatedData);
    const newCData=cDataTemp.filter(p=>p.id!==gameId);
    newGameCalculatedData.data.push(responseData);
    newCData.push(newGameCalculatedData);
    setAddValue("");
    setCalculatedData(newCData);
  }

    const addParameter = (gameId, name) => async () => {
      const parametersTemp=parameters;
      if(parameters.filter(p=>p.id===gameId).length>0){
        if(name==="" || parameters.filter(p=>p.id===gameId)[0].data.filter(d=>d.name===name).length>0){
          alert("No se puede insertar el nuevo parámetro. Asegúrese de haber rellenado los campos correctamente.");
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

  const addOperation = async () => {
    if(addValue==="" || addNoParameters==="" || importedData===null){
      alert("No se puede insertar la nueva operación. Asegúrese de haber rellenado todos los campos correctamente.");
      return;
    }
    const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/operation/insertOperation", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: addValue, noParameters: addNoParameters }),
    });
    if(!response.ok){
      alert("No se pudo insertar la nueva operación. Asegúrese de haber rellenado todos los campos correctamente.");
      return;
    }
    const responseData = await response.json();

    const responseRaw = await fetch(process.env.REACT_APP_SESSIONS_URL+"/rawDataOperation/insertOperation", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ python: importedData, id: responseData.id }),
    });
    if(!responseRaw.ok){
      alert("No se pudo insertar la nueva operación. El código importado no es válido. Inténtelo más tarde.");
      return;
    }
    setOperations([... operations, responseData]);
    setAddValue("");
    setNewOperationActivated(0);
  }

  const deactivateNewGamePanel = () => {
    setNewGameActivated(0);
  }

  const deactivateNewOperationPanel = () => {
    setNewOperationActivated(0);
  }

  const handleOperationChanged = (event) => {
    setSelectedOperation(event.target.value);
    if(event.target.value===""){
      setCDataParameters([]);
      return;
    }
    const noParameters=operations.filter(op=>op.id===event.target.value)[0].no_parameters;
    const newCDataParameters=[];
    for(var i=0;i<noParameters;i++){
      newCDataParameters.push("");
    }
    setCDataParameters(newCDataParameters);
  }

  const handleParameterChanged = index => async (event,value) => {
    const newCDataParameters=[...cDataParameters];
    newCDataParameters[index]=event.target.value;
    setCDataParameters(newCDataParameters);
  }

  const updateNoParameters = (event) => {
    if((event.target.value<10 && event.target.value>0)||event.target.value===""){
      setAddNoParameters(event.target.value);
    }
  }

  return (
  <>
  <div class="app">
    <h1 class="main-title">Panel de administración</h1> 
    <div className="list-container">
      <h3 style={{marginTop: "40px", fontSize: "30px"}}>OPERACIONES</h3>
      <div className="scrollable-list" id="scrollable-list">
        {operations.map((o, index) => (
          <div
            key={index}
            className={`list-item`}>
            {o.name}
          </div>
        ))}
        {newOperationActivated===1?
          <div class="list-item">
            <input placeholder="Escribe el nombre" value={addValue} onChange={(e) => setAddValue(e.target.value)}></input>
            <button className="button-admin-cancel" onClick={deactivateNewOperationPanel}> Cancelar </button>
            <button className="button-admin-new" onClick={addOperation}> Añadir </button>
            <div className={`list-item`}>
              <input type='number' onChange={updateNoParameters} placeholder="No. Parámetros (1-9)" value={addNoParameters}/>
            </div>
            <div class="list-item">
              <label className="button-import-python" htmlFor="import-python">
              +º
              {importedFileName && <p className="filename">{importedFileName}</p>}
              </label>
              <input
              type="file"
              id="import-python"
              accept=".py"
              onChange={handleImportPython}
              style={{ display: "none" }}
              />
          </div>
          </div>
        :""}
      </div>
      <button className="button-admin-add" onClick={activateNewOperationPanel}>+</button>
    </div>
    <h3 style={{marginTop: "40px", fontSize: "30px", fontWeight: "bold"}}>JUEGOS</h3>
    {games.map((game) => (
    <div class="rectangle">
    <h3 class="title">{game.name}</h3>
    <div className="admin-container">
      {/* Margen izquierdo */}
      <div className="admin-left">
          <div className="list-container">
            <label>PARÁMETROS</label>
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
          <label>CÁLCULOS</label>
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
              <button className="button-admin-new" onClick={addCData(game.id)}> Añadir </button>
              <div className={`list-item`}>
                <select id="dropdown" className='date-input' value={selectedOperation} onChange={handleOperationChanged}> 
                  <option value="">Selecciona una operación</option>
                  {operations?.map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              {cDataParameters?.map((parameter, index) =>
                <div className={`list-item`}>
                  <select id="dropdown" className='date-input' value={parameter} onChange={handleParameterChanged(index)}> 
                  <option value="">{"Parámetro "+index}</option>
                  {parameters.filter(p=>p.id===game.id)[0]?.data.map((parameter, index2) => (
                    <option key={index2} value={parameter.id}>
                      {parameter.name}
                    </option>
                  ))}
                </select>
                </div>
              )}
              </div>
            </>
            :""}
          </div>
        <button className="button-admin-add" onClick={activateNewCalculatedDataPanel(game.id)}>+</button>
        </div>
      </div>
    </div>
    </div>
    ))}
    <button className="button-admin-game" onClick={activateNewGamePanel}>Nuevo juego</button>
    {newGameActivated===1?
      <div class="rectangle">
        <input placeholder="Escribe el nombre" value={addValue} onChange={(e) => setAddValue(e.target.value)}></input>
        <button className="button-admin-cancel" onClick={deactivateNewGamePanel}> Cancelar </button>
        <button className="button-admin-new" onClick={addGame(addValue)}> Añadir </button>
      </div>
    :""}
    </div>
    </>
  );
 }

export default Admin;