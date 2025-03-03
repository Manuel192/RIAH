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

  const [treeData,setTreeData] = useState({
        name: "a_0",
        level: 0,
        type: "Operation",
        value:"",
        children: [
          /*{
            name: "a_1",
            level: 1,
            type: "Operation",
            value:"Mean",
            children: [
              { name: "a_2", level:2, type: "Parameter",value:"",children:[]},
              { name: "b_2",level:2, type: "Operation",value:"",children:[]},
            ],
          },*/
        ],
      },
  );

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

  const deactivateNewGamePanel = () => {
    setNewGameActivated(0);
  }

  const deactivateNewOperationPanel = () => {
    setNewOperationActivated(0);
  }

  const handleOperationChanged = (event,node) => {
    modifyChilds(treeData, node, event.target.value, "Operation", operations.filter(o=>(o.id===event.target.value))[0].no_parameters);
  }

  const handleParameterChanged = (event,node) =>{
    modifyChilds(treeData, node, event.target.value, "Parameter", 0);
  }

  const handleFieldChanged = (event,node,newType) => {
    modifyChilds(treeData, node, "", newType, 0);
  }

  const modifyChilds = (currentNode, node, childValue, childType, noChilds) => {
    console.log(operations);
    if(currentNode===node && currentNode.level===0){
      var children=[];
      for(var i=0;i<noChilds;i++){
        children.push({name: "c_"+i+"_"+(node.level+1), level: node.level+1, type: "Operation", children:[]})
      }
      setTreeData( {
        ...node, value: childValue, type: childType, children:children
      })
    }
    if(currentNode===node){
      var children=[];
      for(var i=0;i<noChilds;i++){
        children.push({name: "c_"+i+"_"+(node.level+1), level: node.level+1, type: "Parameter", children:[]})
      }
      console.log({...node, value: childValue, type: childType, children:children});
      return {
        ...node, value: childValue, type: childType, children:children
      }
    }
    else if(currentNode.children){
      const children=currentNode.children;
      for(var i=0;i<children.length;i++){
        const nonExploredNodes=children.filter(c=>c!==children[i]);
        const nodeFound=modifyChilds(children[i], node, childValue, childType, noChilds);
        if(nodeFound!==null && currentNode.level===0){
          setTreeData({...treeData,children:[...nonExploredNodes, nodeFound]});
          console.log({...treeData,children:[...nonExploredNodes, nodeFound]});
          return;
        }
        if(nodeFound!==null){
          return({
          ...currentNode,
          children: [...nonExploredNodes, nodeFound]});
        }
      }
    } return null;
  };  

  const TreeNode = ({ node, game }) => {
      return (
        <div>
          {node.type && (node.type==="Operation"?
          <select id="dropdown" value={node.value} className='input-parameter' onChange={(e)=>handleOperationChanged(e,node)}>
            <option value="">Selecciona una operación</option>
            {operations?.map((option, index) => (
              <option key={index} value={option.id}>
                {option.name}
              </option>
            ))}
            </select>
            :
            <select id="dropdown" value={node.value} className='input-parameter' onChange={(e)=>handleParameterChanged(e,node)}>
              <option value="">{"Parámetro 1"}</option>
              {parameters.filter(p=>p.id===game.id)[0]?.data.map((parameter, index) => (
                <option key={index} value={parameter.id}>
                  {parameter.name}
                </option>
              ))}
            </select>)}
          {node.type && node.level>0 && (
              node.type==="Operation"?
                <button className="button-admin-change-parameter" onClick={(e)=>handleFieldChanged(e,node,"Parameter")}> Parámetro </button>
              :
                <button className="button-admin-change-parameter" onClick={(e)=>handleFieldChanged(e,node,"Operation")}> Operación </button>
          )}
          {node.children && node.children.length>0 && (
            <div class={node.level%2===0?"gray-rectangle":"rectangle"}>
              {node.children.map((child, index) => (
                <TreeNode key={index} node={child} game={game} />
              ))}
            </div>
          )}
        </div>
      );
    };

  return (
  <>
  <div class="app">
    <h1 class="main-title">Panel de administración</h1> 
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
                <button className="button-admin-cancel" onClick={deactivateNewParameterPanel(game.id)}> Cancelar </button>
                <button className="button-admin-new" onClick={addParameter(game.id, addValue)}> Añadir </button>
                <TreeNode node={treeData} game={game} />
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
};

export default Admin;