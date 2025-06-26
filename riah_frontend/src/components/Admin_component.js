import React, { act, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Admin_component.css';
import '../App.css';

function Admin({redirect}) {    
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [versions, setVersions] = useState([]);  
  const [operation, setOperation] = useState([]);
  const [newVersionActivated, setNewVersionActivated] = useState([]);
  const [newParameterActivated, setNewParameterActivated] = useState([]);
  const [newOperationActivated, setNewOperationActivated] = useState([]);
  const [newGameActivated, setNewGameActivated] = useState(0);
  const [newSimpleOperationActivated, setNewsimpleOperationActivated] = useState(0);
  const [addValue, setAddValue] = useState("");

  const [simpleOperations, setsimpleOperations] = useState([]);
  const [selectedsimpleOperation, setSelectedsimpleOperation] = useState();
  const [operationParameters, setoperationParameters] = useState ([]);

  const operationColors = [
    "#fcbdbd","#fcdebd","#fcfbbd","#d3fcbd","#bdfce1","#bde0fc","#c0bdfc","#eebdfc","#fcbde4"
  ];

  const [treeData,setTreeData] = useState({
        name: "a_0",
        level: 0,
        type: "Operation",
        value:"",
        valueName:"",
        returnType:"value",
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

  useEffect(() => {
    const init = async () => {
      await redirect();
      const listContainer = document.getElementById("scrollable-list");
      if (listContainer) {
        listContainer.scrollTop = listContainer.scrollHeight;
      }
      try{
        const responseGames = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/loadGames");
        if(!responseGames.ok){
          setGames([]);
          return;
        }
        // convert data to json
        const gamesParsed = await responseGames.json();
        setGames(gamesParsed);
        const responsesimpleOperations = await fetch(process.env.REACT_APP_SESSIONS_URL+"/operation/loadSimpleOperations");
        if(!responsesimpleOperations.ok){
          setsimpleOperations([]);
          return;
        }
        // convert data to json
        const simpleOperationsParsed = await responsesimpleOperations.json();
        setsimpleOperations(simpleOperationsParsed);

        var newActivatedTemp=[];
        var OperationTemp=[];
        var parametersTemp=[];
        for(var i=0;i<gamesParsed?.length;i++){
          newActivatedTemp.push({"id":gamesParsed[i].id,"value":0});
          const responseOperation = await fetch(process.env.REACT_APP_GENERAL_URL+"/operation/loadOperations?gameId="+gamesParsed[i].id);
          if(responseOperation.ok){
            const OperationParse=await responseOperation.json();
            OperationTemp.push({"id":gamesParsed[i].id,"data":OperationParse});
          }

          const responseParameters = await fetch(process.env.REACT_APP_GENERAL_URL+"/parameter/loadParameters?gameId="+gamesParsed[i].id);
          if(responseParameters.ok){
            const parameterParse=await responseParameters.json();
            parametersTemp.push({"id":gamesParsed[i].id,"data":parameterParse});
          }
        }
        setOperation(OperationTemp);
        setParameters(parametersTemp);
        setNewParameterActivated(newActivatedTemp);
        setNewsimpleOperationActivated(newActivatedTemp);
      }catch(error){
      }
    }
    init();
  }, []);

  const activateNewGamePanel = () =>{
    setNewGameActivated(1);
  }

  const activateNewVersionPanel = gameId => () => {
    var newVersionActivatedTemp=newVersionActivated.filter(p=>(p.id!==gameId));
    newVersionActivatedTemp.push({"id":gameId,"value":1});
    setNewVersionActivated(newVersionActivatedTemp);
  }

  const activateNewParameterPanel = gameId => () => {
    var newParameterActivatedTemp=newParameterActivated.filter(p=>(p.id!==gameId));
    newParameterActivatedTemp.push({"id":gameId,"value":1});
    setNewParameterActivated(newParameterActivatedTemp);
  }

  const activateNewOperationPanel = gameId => () =>{
    var operationActivatedTemp=newOperationActivated.filter(p=>(p.id!==gameId));
    operationActivatedTemp.push({"id":gameId,"value":1});
    setNewOperationActivated(operationActivatedTemp);
  }

  const deactivateNewVersionPanel = gameId => () => {
    var newVersionActivatedTemp=newVersionActivated.filter(p=>(p.id!==gameId));
    newVersionActivatedTemp.push({"id":gameId,"value":0});
    setNewVersionActivated(newVersionActivatedTemp);
  }

  const deactivateNewParameterPanel = gameId => () => {
    var newParameterActivatedTemp=newParameterActivated.filter(p=>(p.id!==gameId));
    newParameterActivatedTemp.push({"id":gameId,"value":0});
    setNewParameterActivated(newParameterActivatedTemp);
  }

  const deactivateNewOperationPanel = gameId => () => {
    var operationActivatedTemp=newOperationActivated.filter(p=>(p.id!==gameId));
    operationActivatedTemp.push({"id":gameId,"value":0});
    setNewOperationActivated(operationActivatedTemp);
  }

  const addOperation = (gameId) => async () => {
    if(!addValue){
      alert("Asegúrese de rellenar todos los campos antes de crear una operación.")
      return;
    }
    const OperationTemp=operation;

    const responseMongo = await fetch(process.env.REACT_APP_SESSIONS_URL+"/operation/insertOperation", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: treeData.value.split("#")[0], children: treeData.children }),
    });

    if(!responseMongo.ok){
      alert("No se pudo insertar el nuevo cálculo. Asegúrese de haber rellenado los campos correctamente.");
      return;
    }

    const operationId=await responseMongo.text();

    const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/operation/insertOperation", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operationId:operationId, name: addValue, game: gameId, id: "" }),
    });

    if(!response.ok){
      alert("No se pudo insertar el nuevo cálculo. Asegúrese de haber rellenado los campos correctamente.");
      return;
    }

    const responseData = await response.json();
    const newGameOperation=OperationTemp.filter(p=>p.id===gameId)[0] || {id: gameId, data: []};
    const newOperation=OperationTemp.filter(p=>p.id!==gameId);
    newGameOperation.data.push(responseData);
    newOperation.push(newGameOperation);
    setAddValue("");
    setOperation(newOperation);
    setTreeData({
      ...treeData, children:[], value:""
    });
    const newOperationActivatedTmp=newOperationActivated.filter(o=>(o.id!==gameId));
    setNewOperationActivated([...newOperationActivatedTmp, {id:gameId,value:0}]);
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

  const addVersion = (gameId, name) => async () => {
    const versionsTemp=versions;
    const newVersions=versionsTemp.filter(p=>p.id!==gameId);
    newVersions.push({id:gameId,data:[{name:name}]});
    setAddValue("");
    setVersions(newVersions);
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

  const handleOperationChanged = (event,node) => {
    if(event.target.value!==""){
      modifychildren(treeData, node,  event.target.value, event.target.value.split("#")[1], 
    "Operation",simpleOperations.filter(o=>(o.id===event.target.value.split("#")[0]))[0].return_type, simpleOperations.filter(o=>(o.id===event.target.value.split("#")[0]))[0].parameters);
    }
    else{
      removechildren(treeData, node);
      modifychildren(treeData, node, "","", "Operation", "", []);
    }
  }

  const handleParameterChanged = (event,node) =>{
    modifychildren(treeData, node, event.target.value, event.target.value.split("#")[1], "Parameter", node.returnType, []);
    console.log(treeData);
  }

  const handleFieldChanged = (event,node,newType) => {
    removechildren(treeData, node);
    modifychildren(treeData, node, "","", newType, node.returnType, []);
  }

  const modifychildren = (currentNode, node, childValue, childName, childType, childReturnType, children) => {
    if(currentNode===node && currentNode.level===0){
      var newChildren=[];
      if(children){
        for(var i=0;i<children.length;i++){
          newChildren.push({name: "c_"+i+"_"+(node.level+1), level: node.level+1, type: "Operation", returnType:children[i], children:[]})
        }
      }
      setTreeData({
        ...node, value: childValue, valueName: childName, type: childType, returnType:childReturnType, children:newChildren
      })
    }
    if(currentNode===node){
      var newChildren=[];
      if(children){
        for(var i=0;i<children.length;i++){
          newChildren.push({name: "c_"+i+"_"+(node.level+1), level: node.level+1, type: "Parameter", returnType:children[i], children:[]})
        }
      }
      return {
        ...node, value:childValue, valueName:childName, type:childType, returnType:childReturnType, children:newChildren
      }
    }
    else if(currentNode.children){
      const newChildren=currentNode.children;
      for(var i=0;i<newChildren.length;i++){
        const nonExploredNodes=newChildren.filter(c=>c!==newChildren[i]);
        const nodeFound=modifychildren(newChildren[i], node, childValue,childName, childType, childReturnType, children);
        if(nodeFound!==null && currentNode.level===0){
          setTreeData({...treeData,children:[...nonExploredNodes, nodeFound]});
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

  const removechildren = (currentNode, node) => {
    if(currentNode===node && currentNode.level===0){
      setTreeData( {
        ...node, children:[], value:""
      })
    }
    if(currentNode===node){
      return {
        ...node, children:[], value:""
      }
    }
    else if(currentNode.children){
      const children=currentNode.children;
      for(var i=0;i<children.length;i++){
        const nonExploredNodes=children.filter(c=>c!==children[i]);
        const nodeFound=modifychildren(children[i], node);
        if(nodeFound!==null && currentNode.level===0){
          setTreeData({...treeData,children:[...nonExploredNodes, nodeFound]});
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
          {node.type && node.returnType==="list" && node.type==="Operation" &&
            <select id="dropdown" value={node.value} className='input-parameter' onChange={(e)=>handleOperationChanged(e,node)}>
              <option value="">Selecciona una operación</option>
              {simpleOperations?.filter(o=>o.return_type==="list").sort(function(a, b) {
                  if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                  if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                  return 0;
                }).map((option, index) =>
                <option key={index} value={option.id+"#"+option.name}>
                  {option.name}
                </option>
              )}
            </select>
          }
          {node.type && node.returnType==="list" && node.type==="Parameter" &&
            <select id="dropdown" value={node.value} className='input-parameter' onChange={(e)=>handleParameterChanged(e,node)}>
              <option value="">Selecciona un parámetro</option>
              {parameters.filter(p=>p.id===game.id)[0]?.data.sort(function(a, b) {
                  if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                  if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                  return 0;
                }).map((parameter, index) => (
                <option key={index} value={parameter.id+"#"+parameter.name}>
                  {parameter.name}
                </option>
              ))}
            </select>
          }
          {node.type && node.returnType==="value" && node.type==="Operation" &&
            <select id="dropdown" value={node.value} className='input-parameter' onChange={(e)=>handleOperationChanged(e,node)}>
              <option value="">Selecciona una operación</option>
              {simpleOperations?.filter(o=>o.return_type==="value").sort(function(a, b) {
                  if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                  if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                  return 0;
                }).map((option, index) =>
                <option key={index} value={option.id+"#"+option.name}>
                  {option.name}
                </option>
              )}
            </select>
          }
          {node.type && node.returnType==="value" && node.type==="Parameter" &&
            <input value={node.value} className='input-parameter' placeholder="Escribe un valor" onChange={(e)=>handleParameterChanged(e,node)}/>
          }
          {node.type && node.level>0 && (
              node.type==="Operation"?
                <button className="button-admin-change-parameter" onClick={(e)=>handleFieldChanged(e,node,"Parameter")}> Parámetro </button>
              :
                <button className="button-admin-change-parameter" onClick={(e)=>handleFieldChanged(e,node,"Operation")}> Operación </button>
          )}
          {node.children && node.children.length>0 && (
            <div class="non-bg-rectangle" style={{backgroundColor: operationColors[node.level%operationColors.length]}}>
              {node.children.sort(function(a, b) {
                  if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                  if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                  return 0;
                }).map((child, index) => (
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
    <h1 class="main-title">¡Bienvenido Administrador!</h1>
    <div class="preview-text">
      ¡Bienvenid@ a una versión temprana de RIAH. Esta plataforma le permitirá administrar la información de sus minijuegos,
       parámetros y operaciones a consultar a partir dela información obtenida de la plataforma Rehab-Immersive.
    </div>
    <br></br>
    <h3 style={{marginTop: "40px", fontSize: "30px", fontWeight: "bold"}}>JUEGOS SERIOS</h3>
    {games.map((game) => (
    <div class="rectangle">
    <h3 class="title">{game.name}</h3>
    <div className="admin-container">
        <div className="list-container admin-panel">
            <label>Versiones</label>
            <div className="long-scrollable-list" id="scrollable-list">
            {versions.filter(p=>p.id===game.id)[0]?.data.sort(function(a, b) {
                  if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                  if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                  return 0;
                }).map((p, index) => (
              <div
                key={index}
                className={`list-item`}>
                {p.name}
              </div>
            ))}
            {newVersionActivated.filter(p=>p.id===game.id)[0]?.value===1?
              <div className={`list-item`}>
                <input placeholder="Escribe el identificador" value={addValue} onChange={(e) => setAddValue(e.target.value)}></input>
                <button className="button-admin-cancel" onClick={deactivateNewVersionPanel(game.id)}> Cancelar </button>
                <button className="button-admin-new" onClick={addVersion(game.id, addValue)}> Añadir </button>
              </div>
            :""}
          </div>
          <button className="button-admin-add" onClick={activateNewVersionPanel(game.id)}>+</button>
        </div>
      
        <div className="list-container admin-panel">
            <label>Parámetros</label>
            <div className="long-scrollable-list" id="scrollable-list">
            {parameters.filter(p=>p.id===game.id)[0]?.data.sort(function(a, b) {
                  if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                  if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                  return 0;
                }).map((p, index) => (
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

        <div className="list-container admin-panel">
          <label>Operaciones</label>
          <div className="long-scrollable-list" id="scrollable-list">
          {operation.filter(Operation=>Operation.id===game.id)[0]?.data.map((Operation, index) => (
            <div
              key={index}
              className={`list-item`}>
              {Operation.name}
            </div>
          ))}
          {newOperationActivated.filter(p=>p.id===game.id)[0]?.value===1?
          <>
          <div className={`list-item`}>
          <input placeholder="Escribe el nombre" value={addValue} onChange={(e) => setAddValue(e.target.value)}></input>
              <button className="button-admin-cancel" onClick={deactivateNewOperationPanel(game.id)}> Cancelar </button>
              <button className="button-admin-new" onClick={addOperation(game.id, addValue)}> Añadir </button>
              <TreeNode node={treeData} game={game} />
          </div>
          </>
          :""}
          </div>
        <button className="button-admin-add" onClick={activateNewOperationPanel(game.id)}>+</button>
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