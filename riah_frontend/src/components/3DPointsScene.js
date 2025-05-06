// src/Scene.jsx
import React from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useNavigate, useLocation} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BooleanKeyframeTrack } from "three";
import { useSpring, animated } from "@react-spring/three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Suspense } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader ,} from "three/examples/jsm/loaders/STLLoader.js";
import { BufferGeometry } from 'three'
import { Grid, Center, Text, GizmoHelper, GizmoViewport,OrbitControls,Line, AccumulativeShadows, RandomizedLight, Environment, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'

const colorWheel=['#ff0000','#ff4000','#ff8000','#ffbf00','#ffff00','#bfff00','#80ff00','#40ff00','#00ff00','#00ff40','#00ff80','#00ffbf','#00ffff','#00bfff','#0080ff',
  '#0040ff','#0000ff','#4000ff','#8000ff','#bf00ff','#ff00ff','#ff00bf','#ff0080','#ff0040','#ff0000']

const PointsScene = () => {
  const navigate=useNavigate();
  const location=useLocation();

  const {dataItems, activeSessionData}=location.state;

  const [mins, setMins]=useState(null);
  const [maxs,setMaxs]=useState(null);
  const desiredScale=30;
  const [pointScale, setPointScale]=useState(0.1);
  const [fontScale, setFontScale]=useState(0.1)
  const [pos, setPos]=useState(["HeadPosition_x","HeadPosition_y","HeadPosition_z"]);

  const[normalizedPoints, setNormalizedPoints]=useState([]);

  /* https://codesandbox.io/p/sandbox/19uq2u?file=%2Fsrc%2FApp.js%3A9%2C58 */
      const { gridSize, ...gridConfig } = useControls({
        gridSize: [10.5, 10.5],
        cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
        cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
        cellColor: '#6f6f6f',
        sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
        sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
        sectionColor: '#42a4ce',
        fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
        fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
        infiniteGrid: true
      })

  useEffect(()=>{
    var currentMax=[null,null,null];
    var currentMin=[null,null,null];
    var newNormalizedPoints=[];
    var distanceSum=[0,0,0];

    // Obtain minimums, maximums and normalized points
    for(var i=0;i<activeSessionData.frames.length;i++){
      var frame=activeSessionData.frames[i];
      if(!currentMax[0] || Number(frame.dataValues[pos[0]])>Number(currentMax[0]))
          currentMax[0]=frame.dataValues[pos[0]];
      else if(!currentMin[0] || Number(frame.dataValues[pos[0]])<Number(currentMin[0]))
        currentMin[0]=frame.dataValues[pos[0]];
      if(!currentMax[1] || Number(frame.dataValues[pos[1]])>Number(currentMax[1]))
        currentMax[1]=frame.dataValues[pos[1]];
      else if(!currentMin[1] || Number(frame.dataValues[pos[1]])<Number(currentMin[1]))
        currentMin[1]=frame.dataValues[pos[1]];
      if(!currentMax[2] || Number(frame.dataValues[pos[2]])>Number(currentMax[2]))
        currentMax[2]=frame.dataValues[pos[2]];
      else if(!currentMin[2] || Number(frame.dataValues[pos[2]])<Number(currentMin[2]))
        currentMin[2]=frame.dataValues[pos[2]];
      distanceSum[0]+=Number(frame.dataValues[pos[0]]);
      distanceSum[1]+=Number(frame.dataValues[pos[1]]);
      distanceSum[2]+=Number(frame.dataValues[pos[2]]);
    }
    
    var dataLength=activeSessionData.frames.length;
    setMins(currentMin);
    setMaxs(currentMax);

    // Obtain minimum/maximum differences
    var currentFactors=[null,null,null];
    for(i=0;i<currentMax.length;i++){
      currentFactors[i]=currentMax[i]-currentMin[i];
    }
    
    for(i=0;i<activeSessionData.frames.length;i++){
      var frame=activeSessionData.frames[i];
      newNormalizedPoints=[...newNormalizedPoints,[(Number(frame.dataValues[pos[0]]) - Number(distanceSum[0]/dataLength)) * desiredScale / currentFactors[0], 
      (Number(frame.dataValues[pos[1]]) - Number(distanceSum[1]/dataLength)) * desiredScale / currentFactors[1],
      (Number(frame.dataValues[pos[2]]) - Number(distanceSum[2]/dataLength)) * desiredScale / currentFactors[2]]];
    }
    setNormalizedPoints(newNormalizedPoints);
    console.log(newNormalizedPoints[0]);
  },[])

  const VideoScene = () => {

    const pointModel=useLoader(OBJLoader,'/point.obj').children[0].geometry;
    const camera=useThree();
    
    useFrame(()=>{
      camera.camera.fov=40;
      }
    );

    return (
      <>
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 5]} intensity={3}/>
        <directionalLight position={[-10, -10, -5]} intensity={1}/>
        <OrbitControls enableZoom={true}>
        </OrbitControls>

        <group position={[0, -0.5, 0]}>
            {normalizedPoints.map((point,index)=>(
            <>
            <mesh position={point} geometry={pointModel} rotation={[0, 0, 0]} scale={[pointScale,pointScale,pointScale]}>
              <meshStandardMaterial color={colorWheel[index % colorWheel.length]} />
            </mesh>
            <Text position={[point[0],point[1]+pointScale*2,point[2]]} color="white" fontSize={fontScale}>
              P{(index+1)+" ["+activeSessionData.frames[index].dataValues[pos[0]]+", "+activeSessionData.frames[index].dataValues[pos[1]]+", "+activeSessionData.frames[index].dataValues[pos[2]]+"]"}
            </Text>
             
            {index+1<normalizedPoints.length && (
              <Line
                points={[point,normalizedPoints[index+1]]}
                color="white"
                lineWidth={1}
                segments
              />
            )}
            </>

            ))}
        </group>

        <GizmoHelper>
          <GizmoViewport disabled={true} axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
        </GizmoHelper>
        </>
    ); 
  };
    const VideoVariables = () => {

    const handleSetPointScale=(value)=>{
      if(value>0)
        setPointScale(value/10);
    }
    
    const handleSetFontScale=(value)=>{
      if(value>0)
        setFontScale(value/10);
    }

    return (
      <div className="contenedor-secciones">
        <div className="seccion-izquierda" style={{marginLeft: "1%", minHeight: "800px", width:"14%", right:"80%"}}>
          <div>
          <label class="title">↓ Posición ↓</label>
          <>
          <h3>Posición X</h3>
          <div style={{marginLeft: "10px"}}>
            <select id="dropdown" value={pos[0]} className='input-parameter' onChange={(e)=>setPos([e.target.value,pos[1],pos[2]])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          <h3>Posición Y</h3>
          <div style={{marginLeft: "10px"}}>
            <select id="dropdown" value={pos[1]} className='input-parameter' onChange={(e)=>setPos([pos[0],e.target.value,pos[2]])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          <h3>Posición Z</h3>
          <div style={{marginLeft: "10px"}}>
            <select id="dropdown" value={pos[2]} className='input-parameter' onChange={(e)=>setPos([pos[0],pos[1],e.target.value])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          </>
          <label class="title">↓ Opciones ↓</label>
          <>
            <h3>Tamaño de puntos</h3>
            <div>
              <input 
                type="number"
                placeholder="1"
                value={pointScale*10} 
                onChange={(e) => handleSetPointScale(e.target.value)} 
                className="date-input"
              />
            </div>
            <h3>Tamaño de fuente</h3>
            <div>
              <input 
                type="number"
                placeholder="1"
                value={fontScale*10} 
                onChange={(e) => handleSetFontScale(e.target.value)} 
                className="date-input"
              />
            </div>
          </>
          </div>
        </div>
      </div>
    )
  }

  return(
  <>
    <h1 class="main-title" style={{position:"fixed", right:"40%"}}>Visualización 3D</h1>
    <Suspense>
      <Canvas gl={{preserveDrawingBuffer:true}} camera={{zoom:0.3, fov:40}} style={{height:"70%", top:0, position:"fixed", marginLeft:"15%", width:"85%",marginTop:"150px", zIndex:"0", borderColor:"#ebf9fc", borderWidth:"10px", backgroundColor:"#192124"}}>
        <VideoScene/>
      </Canvas>
    </Suspense>
    <VideoVariables/>
  </>
  );
}

export default PointsScene;