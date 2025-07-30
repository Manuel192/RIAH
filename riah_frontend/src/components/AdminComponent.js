import React, { act, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/AdminComponent.css';
import '../App.css';
import { RiImageEditFill } from '@remixicon/react';

function Admin({redirect}) {    
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [versions, setVersions] = useState([]);  
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("");
  
  const [newVersionActivated, setNewVersionActivated] = useState([]);
  const [importedFileName, setImportedFileName] = useState("");
  const [importedData, setImportedData] = useState("");

  const [apkFile, setApkFile] = useState();
  const [imageFile, setImageFile] = useState();

  const [newOperationActivated, setNewOperationActivated] = useState([]);
  const [newGameActivated, setNewGameActivated] = useState(0);
  const [addValue, setAddValue] = useState("");

  const [operations, setOperations] = useState([]);
  const [operationsParameters, setOperationsParameters] = useState([]);
  const [simpleOperations, setsimpleOperations] = useState([]);

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isModalOperationOpen, setIsModalOperationOpen] = useState(false);

   useEffect(() => {
    const init = async () => {
      await redirect();
      const listContainer = document.getElementById("scrollable-list");
      if (listContainer) {
        listContainer.scrollTop = listContainer.scrollHeight;
      }
      try{
        const responseGames = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/loadGames", {
            headers: {
                'Authorization': 'Bearer '+sessionStorage.getItem("token"),
            },
          });

        if(!responseGames.ok){
          setGames([]);
          return;
        }

        const gamesParsed = await responseGames.json();
        setGames(gamesParsed);

        const responsesimpleOperations = await fetch(process.env.REACT_APP_SESSIONS_URL+"/operation/loadSimpleOperations",{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
        if(!responsesimpleOperations.ok){
          setsimpleOperations([]);
          return;
        }
        
        const simpleOperationsParsed = await responsesimpleOperations.json();
        setsimpleOperations(simpleOperationsParsed);

        const responseVersions = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/loadVersions?token="+sessionStorage.getItem("token"), {
            headers: {
                'Authorization': 'Bearer '+sessionStorage.getItem("token"),
            },
          });
        if(!responseVersions.ok){
          setVersions([]);
          return;
        }

        const responseOperationsParameters = await fetch(process.env.REACT_APP_SESSIONS_URL+"/operation/loadOperationsParameters",{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
        if(responseOperationsParameters.ok){
          const operationsParametersParsed = await responseOperationsParameters.json();
          setOperationsParameters(operationsParametersParsed);
          console.log(operationsParametersParsed);
        }

        const versionsParsed = await responseVersions.json();
        setVersions(versionsParsed);
        setSelectedVersion(versionsParsed[0]);

        var operationTemp=[];
        var parametersTemp=[];
        var operationParse=[];
        var parameterParse=[];

        const responseOperations = await fetch(process.env.REACT_APP_GENERAL_URL+"/operation/loadOperations",{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
        if(responseOperations.ok){
          operationParse=await responseOperations.json();
        }
        const responseParameters = await fetch(process.env.REACT_APP_GENERAL_URL+"/parameter/loadParameters",{
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      });
        if(responseParameters.ok){
            parameterParse=await responseParameters.json();
        }

        for(var i=0;i<gamesParsed?.length;i++){
            operationTemp.push({"id":gamesParsed[i].id,"data":operationParse.filter(op=>op.game_id===gamesParsed[i].id)});
        }
        for(var i=0;i<versionsParsed?.length;i++){
            parametersTemp.push({"id":versionsParsed[i].id,"data":parameterParse.filter(p=>p.version_id===versionsParsed[i].id)});
        }
        setOperations(operationTemp);
        setParameters(parametersTemp);
      }catch(error){
        console.log(error);
      }
    }
    init();
  }, []);


   function ModalOperation ({game}) {
    const [name, setName] = useState("");
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3 style={{fontSize:"40px", fontWeight:"bold"}}>Crear operación</h3>
          <div style={{display:"flex", justifyContent:"space-between"}}>
          <input placeholder="Escribe el nombre" value={name} onChange={(e) => setName(e.target.value)}></input>
              <button className="button-admin-cancel" onClick={deactivateNewOperationPanel(game.id)}> Cancelar </button>
              <button className="button-admin-new" onClick={addOperation(game.id, name)}> Añadir </button>
          </div>
          <TreeNode node={treeData} game={selectedVersion} />
        </div>
      </div>
    );
  }
  
    function Modal({operationName}) {

    const [selectedVersion, setSelectedVersion]=useState("");
    const [selectedParameters, setSelectedParameters] = useState({});
    
    useEffect(() => {
      var newSelectedParameters={};
      const correspondingVariables=operationsParameters.filter(op=>op.id===selectedOperation.operation)[0]?.variables;
      if(correspondingVariables){
        for(var i=0;i<correspondingVariables.length;i++){
          newSelectedParameters={...newSelectedParameters, [correspondingVariables[i]]:""};
        }
        setSelectedParameters(newSelectedParameters);
      }
    }, []);

    const handleSetSelectedVersion = (version) => {
      setSelectedVersion(version);
    }

    const handleUpdateSelectedParameters = (operationParameter,value) => {
      var newSelectedParameters=selectedParameters;
      newSelectedParameters[operationParameter]=value;
      setSelectedParameters({...newSelectedParameters});
      console.log({...newSelectedParameters});
      console.log(selectedVersion);
    }

    const handleInsertImplementation = async () => {
      if(Object.keys(selectedParameters).length===0){
        alert("Esta operación no requiere ningún tipo de implementación.")
      }

      for(var i=0;i<Object.keys(selectedParameters).length;i++){
        if(selectedParameters[Object.keys(selectedParameters)[i]].length<1){
          alert("No ha asignado todos los parámetros. Asegúrese de asignarlos e inténtelo más tarde.")
          return;
        }
      }

      console.log(selectedParameters);

      const responseInsert = await fetch(process.env.REACT_APP_GENERAL_URL+"/implementation/insertImplementation",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+sessionStorage.getItem("token"),
        },
        body:JSON.stringify({implementationParameters: selectedParameters, version:selectedVersion.id, operation:selectedOperation.id})
      });
      
      if(!responseInsert.ok){
        alert("Ha ocurrido algo.")
      }else{
        alert("Implementación actualizada exitosamente");
      }
      }

    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3 style={{fontSize:"40px", fontWeight:"bold"}}>{operationName}</h3>
          <div style={{display:"flex", justifyContent:"space-between"}}>
          <div className="long-scrollable-list" id="scrollable-list" style={{marginRight:"20px"}}>
            {versions.filter(v=>v.game===selectedOperation.game_id).map(v=>(
              <div
                className={`list-item ${selectedVersion.id===v.id?` selected`:``}`} onClick={()=>handleSetSelectedVersion(v)} style={{fontWeight:"bold", fontSize:"30px", display:"flex"}}>
                {v.name}
              </div>
              ))}
            </div>
        <div style={{margin:"auto"}}>
        {operationsParameters.filter(op=>op.id===selectedOperation.operation)[0]?.variables.map(op=>(
          <div className="date-field">
            <span>{op}</span>
            <select id="dropdown" value={selectedParameters[op]} onChange={(e)=>handleUpdateSelectedParameters(op,e.target.value)} className="raw-data-input">
              <option value="">Ninguno</option>
              {parameters?.filter(p=>p.id===selectedVersion?.id)[0]?.data.map((p, index) =>
              <option key={index} value={p.id}>
                  {p.name}
              </option>
          )}
            </select>
          </div>
        ))}
          </div>
          </div>
          <button className="button-patients-list" onClick={handleInsertImplementation}>Actualizar</button>
          <button className="button-patients-list" onClick={handleCloseModal}>Cancelar</button>
        </div>
      </div>
    );
  }
  
    const handleCloseModalOperation = () => {
      setIsModalOperationOpen(false);
    };
  
    const handleOpenModal = (operation) => {
      setIsModalOpen(true);
      setSelectedOperation(operation);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  
    const handleConfirm = () => {
      // Acción de confirmaciónsession
      alert("Confirmado");
      setIsModalOpen(false);
    };
  

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
        <input placeholder="Ecribe un nombre" id="dropdown" value={node.value} className='input-parameter' onChange={(e)=>handleParameterChanged(e,node)}>
            
        </input>
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
        <input type="number" value={node.value} className='input-parameter' placeholder="Escribe un valor" onChange={(e)=>handleParameterChanged(e,node)}/>
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

  const activateNewGamePanel = () =>{
    setNewGameActivated(1);
  }

  const activateNewVersionPanel = gameId => () => {
    var newVersionActivatedTemp=newVersionActivated.filter(p=>(p.id!==gameId));
    newVersionActivatedTemp.push({"id":gameId,"value":1});
    setNewVersionActivated(newVersionActivatedTemp);
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

  const deactivateNewOperationPanel = gameId => () => {
    var operationActivatedTemp=newOperationActivated.filter(p=>(p.id!==gameId));
    operationActivatedTemp.push({"id":gameId,"value":0});
    setNewOperationActivated(operationActivatedTemp);
  }

  const handleParameterChanged = (event,node) =>{
    modifychildren(treeData, node, event.target.value, event.target.value.split("#")[1], "Parameter", node.returnType, []);
  }

  const handleFieldChanged = (event,node,newType) => {
    removechildren(treeData, node);
    modifychildren(treeData, node, "","", newType, node.returnType, []);
  }

  const addOperation = (gameId,name) => async () => {
    if(!name){
      alert("Asegúrese de rellenar todos los campos antes de crear una operación.")
      return;
    }
    const OperationTemp=operations;

    const responseMongo = await fetch(process.env.REACT_APP_SESSIONS_URL+"/operation/insertOperation", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token"),
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
          'Authorization': 'Bearer '+sessionStorage.getItem("token"),
      },
      body: JSON.stringify({ operationId:operationId, name: name, game: gameId, id: "" }),
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
    setOperations(newOperation);
    setTreeData({
      ...treeData, children:[], value:""
    });
    const newOperationActivatedTmp=newOperationActivated.filter(o=>(o.id!==gameId));
    setNewOperationActivated([...newOperationActivatedTmp, {id:gameId,value:0}]);
  }

  const handleImportJson = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content=e.target.result;
          const fileExtension = file.name.split(".").pop().toLowerCase();
          // Parseo de nombre
          setImportedFileName(file.name);
          if(fileExtension==="json"){
              const jsonData = await JSON.parse(content);
              setImportedData(jsonData);
          }else if(fileExtension === "csv"){
              const jsonData = parseCSVtoJSON(content);
              setImportedData(jsonData);
          }
        } catch (error) {
          alert("Error parsing JSON file: ", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const parseCSVtoJSON = (csvString) => {
      const lines = csvString.trim().split("\n");
      const headers = lines[0].split(";").map(header => header.trim());
      const result = lines.slice(1).map(line => {
        const values = line.split(";").map(value => value.trim());
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || ""; // Asigna valores a las claves correctas
        });
        return obj;
      });
      return result;
    };

  const addVersion = (gameId, name) => async () => {
    if(versions.filter(v=>v.game===gameId).filter(v=>v.name===name).length>0 || name==="" || importedData===""){
      alert("Identificador inválido o repetido. Pruebe otro.");
      return;
    }
    const formData = new FormData();
      formData.append("file", apkFile);

      try {
        const res = await fetch(process.env.REACT_APP_SESSIONS_URL+"/apk/upload?name="+games.filter(g=>g.id===gameId)[0].name+"_"+name, {
          method: "POST",
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
          body: formData,
        });

        if (!res.ok) {
          alert("Error al subir el archivo.");
        }
      } catch (err) {
        alert("Error de red.");
      }

    const responseVersion = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/insertVersion?token="+sessionStorage.getItem("token"), {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token"),
        },
      body: JSON.stringify({ name: name, game: gameId }),
    });
    if(responseVersion.ok){
      const responseVersionParsed=await responseVersion.text();
      
      const responseParameters = await fetch(process.env.REACT_APP_GENERAL_URL+"/parameter/insertParameters", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token"),
      },
      body: JSON.stringify({ names: Object.getOwnPropertyNames(importedData[0]).filter(name=>name!==""), version: responseVersionParsed }),
      });

      if(responseParameters.ok){
        const responseParametersParsed=await responseParameters.json();
        
        const newVersions=versions
        const newParameters=parameters;
        newParameters.push(responseParametersParsed.map(p=>({id:responseVersionParsed,name:p.name})))
        newVersions.push({id:responseVersionParsed, game:gameId,name:name}); 

        setAddValue("");
        setImportedFileName("");
        setImportedData("");
        setVersions(newVersions);
        setParameters(newParameters);
      }
    }
  }

  const addGame = name => async () => {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const responseImage = await fetch(process.env.REACT_APP_SESSIONS_URL+"/image/upload?name="+name, {
        method: "POST",
          headers: {
              'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
        body: formData,
      });

      var thumbnail="X";

      if (responseImage.ok) {
        thumbnail=await responseImage.text();
      }else{
        alert("Error al subir la imagen.");
      }
    } catch (err) {
      alert("Error de red.");
    }

    const response = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/insertGame?token="+sessionStorage.getItem("token"), {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+sessionStorage.getItem("token"),
          },
      body: JSON.stringify({ name: name, thumbnail: thumbnail }),
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
      modifychildren(treeData, node, event.target.value, event.target.value.split("#")[1], 
    "Operation",simpleOperations.filter(o=>(o.id===event.target.value.split("#")[0]))[0].return_type, simpleOperations.filter(o=>(o.id===event.target.value.split("#")[0]))[0].parameters);
    }
    else{
      removechildren(treeData, node);
      modifychildren(treeData, node, "","", "Operation", "", []);
    }
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

  const handleImportApk = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setApkFile(file);
  }

  const handleImportImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
  }

  return (
  <>
  <div class="app">
    {isModalOpen && (<Modal operationName={selectedOperation.name}/>)}
    <div class="preview-text" style={{textAlign:"center"}}>
      <h1 className="text-6xl text-stone-800 font-bold tracking-wide center" style={{textAlign:"center"}}>¡BIENVENID@ ADMINISTRADOR!</h1>
      <p className="text-xl text-stone-800 mt-4 center" style={{textAlign:"center"}}>Nos alegramos de tenerte de vuelta. Le deseamos mucho ánimo en la gestión de parámetros de su plataforma.</p>
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
            {versions.filter(p=>p.game===game.id).sort(function(a, b) {
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
                <br></br>
                <label className="button-import" style={{marginTop:"10px"}} htmlFor="import-json-csv">
                  {importedFileName? <p className="filename">{importedFileName}</p>:"Importar parámetros"}
                </label>
                <br></br>
                <label className="button-import" style={{marginTop:"10px"}} htmlFor="import-apk">
                  {apkFile? <p className="filename">{apkFile.name}</p>:"Importar APK"}
                </label>
                <div>
                  <input
                    type="file"
                    id="import-json-csv"
                    accept=".json,.csv"
                    onChange={handleImportJson}
                    style={{ display: "none" }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    id="import-apk"
                    accept=".apk"
                    onChange={handleImportApk}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            :""}
          </div>
          <button className="button-admin-add" onClick={activateNewVersionPanel(game.id)}>+</button>
        </div>

        <div className="list-container admin-panel">
          <label>Operaciones</label>
          <div className="long-scrollable-list" id="scrollable-list">
          {operations.filter(Operation=>Operation.id===game.id)[0]?.data.map((Operation, index) => (
            <div onClick={()=>handleOpenModal(Operation)}
              key={index}
              className={`list-item`}>
              {Operation.name}
            </div>
          ))}
          {newOperationActivated.filter(p=>p.id===game.id)[0]?.value===1?
          <ModalOperation game={game}/>
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
        <label className="button-import" style={{marginTop:"10px"}} htmlFor="import-png-jpg">
          {imageFile? <p className="filename">{imageFile.name}</p>:"Importar miniatura"}
        </label>
        <div>
          <input
            type="file"
            id="import-png-jpg"
            accept=".png,.jpg"
            onChange={handleImportImage}
            style={{ display: "none" }}
          />
        </div>
        <button className="button-admin-cancel" onClick={deactivateNewGamePanel}> Cancelar </button>
        <button className="button-admin-new" onClick={addGame(addValue)}> Añadir </button>
      </div>
    :""}
    </div>
    </>
  );
};

export default Admin;