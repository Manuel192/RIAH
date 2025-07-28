// src/Scene.jsx
  import React from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CameraControls, OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { useNavigate, useLocation} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BooleanKeyframeTrack } from "three";
import { useSpring, animated } from "@react-spring/three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Suspense } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import {BufferGeometry} from 'three'
import { Grid, Center, GizmoHelper, GizmoViewport, AccumulativeShadows, RandomizedLight, Environment, useGLTF } from '@react-three/drei'
import { useControls } from 'leva'

const ModelScene = ({redirect}) => {
  const navigate=useNavigate();
  const location=useLocation();

  const {dataItems, activeSessionData}=location.state || {};

  const [hideBodyPanel,setHideBodyPanel]=useState([true,false,false,false,false,false]);

  const [headPos, setHeadPos]=useState(["HeadPosition_x","HeadPosition_y","HeadPosition_z"]);
  const [headRot, setHeadRot]=useState(["HeadRotation_x","HeadRotation_y","HeadRotation_z"]);
  const [rHandPos, setRHandPos]=useState(["RHandPosition_x","RHandPosition_y","RHandPosition_z"]);
  const [rHandRot, setRHandRot]=useState(["RHandRotation_x","RHandRotation_y","RHandRotation_z"]);
  const [lHandPos, setLHandPos]=useState(["LHandPosition_x","LHandPosition_y","LHandPosition_z"]);
  const [lHandRot, setLHandRot]=useState(["LHandRotation_x","LHandRotation_y","LHandRotation_z"]);
  const vrHeadsetRef=useRef(null);
  const bodyRef=useRef(null);
  const headRef=useRef(null);
  const rHandRef=useRef(null);
  const lHandRef=useRef(null);
  
  const [fps, setFps]=useState(10);
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewActivated, setPreviewActivated] = useState(false);
  const intervalRef = useRef(null);

  

  useEffect(() => {
    const init = async () => {
      await redirect();
      if (isPlaying) {
        intervalRef.current = setInterval(() => {
          setFrame((prevIndex) => {
            const nextIndex = (prevIndex + 1) % activeSessionData.frames.length;
            setProgress((nextIndex / (activeSessionData.frames.length - 1)) * 100);
            return nextIndex;
          });
        }, 1000/fps);
      } else {
        clearInterval(intervalRef.current);
      }
      return () => {
        clearInterval(intervalRef.current);
      }
    }
    init();
  }, [isPlaying, activeSessionData.frames.length, fps]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newIndex = Math.floor((clickX / rect.width) * (activeSessionData.frames.length - 1));
    setFrame(newIndex);
    setProgress((newIndex / (activeSessionData.frames.length - 1)) * 100);
  };

  const handleFps = (value) => {
    if(value<=60 && value >= 1)
      setFps(value);
  }

  const handlePreview = () => {
    setPreviewActivated(!previewActivated);
  }

  const VideoScene = () => {
    const geometries=[{pos:[0,3,0],scale:[1, 1, 1],rot:[0,0,0],color:"white"},
    {pos:[2,1,1], scale:[1,1,1], rot:[0,0,Math.PI/2], color:"yellow"},
    {pos:[-2,1,1], scale:[1,1,1], rot:[0,0,3*Math.PI/2], color:"yellow"}];

    const headModel=useLoader(OBJLoader,'/head.obj').children[0].geometry;
    const vrHeadsetModel=useLoader(OBJLoader,'/vrheadset.obj').children[0].geometry;
    const bodyModel=useLoader(OBJLoader,'/body.obj').children[0].geometry;
    const rHandModel=useLoader(OBJLoader,'/right_hand.obj').children[0].geometry;
    const lHandModel=useLoader(OBJLoader,'/left_hand.obj').children[0].geometry;
    const camera=useThree();

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
    
    useFrame(()=>{
      camera.camera.fov=30;
      if(isPlaying){
        console.log(camera);
      }
      if(isPlaying || previewActivated){
        const currentFrameData=activeSessionData.frames[frame];
        if(headRef.current){
          headRef.current.parent.worldToLocal(headRef.current.position);
          headRef.current.position.x=Number(currentFrameData.dataValues[headPos[0]])+Number(geometries[0].pos[0])
          headRef.current.position.y=Number(currentFrameData.dataValues[headPos[1]])+Number(geometries[0].pos[1]);
          headRef.current.position.z=Number(currentFrameData.dataValues[headPos[2]])+Number(geometries[0].pos[2])
          headRef.current.rotation.x=Number(currentFrameData.dataValues[headRot[0]])*Math.PI/180+Number(geometries[0].rot[0])||0;
          headRef.current.rotation.y=Number(currentFrameData.dataValues[headRot[1]])*Math.PI/180+Number(geometries[0].rot[1])||0;
          headRef.current.rotation.z=Number(currentFrameData.dataValues[headRot[2]])*Math.PI/180+Number(geometries[0].rot[2])||0;
          vrHeadsetRef.current.position.x=Number(currentFrameData.dataValues[headPos[0]])+Number(geometries[0].pos[0])
          vrHeadsetRef.current.position.y=Number(currentFrameData.dataValues[headPos[1]])+Number(geometries[0].pos[1]);
          vrHeadsetRef.current.position.z=Number(currentFrameData.dataValues[headPos[2]])+Number(geometries[0].pos[2])
          vrHeadsetRef.current.rotation.x=Number(currentFrameData.dataValues[headRot[0]])*Math.PI/180+Number(geometries[0].rot[0])||0;
          vrHeadsetRef.current.rotation.y=Number(currentFrameData.dataValues[headRot[1]])*Math.PI/180+Number(geometries[0].rot[1])||0;
          vrHeadsetRef.current.rotation.z=Number(currentFrameData.dataValues[headRot[2]])*Math.PI/180+Number(geometries[0].rot[2])||0;
          bodyRef.current.position.x=Number(currentFrameData.dataValues[headPos[0]])+Number(geometries[0].pos[0])
          bodyRef.current.position.y=Number(currentFrameData.dataValues[headPos[1]])+Number(geometries[0].pos[1]);
          bodyRef.current.position.z=Number(currentFrameData.dataValues[headPos[2]])+Number(geometries[0].pos[2])
        }
        if(rHandRef.current){
          rHandRef.current.parent.worldToLocal(rHandRef.current.position);
          rHandRef.current.position.x=Number(currentFrameData.dataValues[rHandPos[0]])*4+Number(geometries[2].pos[0])
          rHandRef.current.position.y=Number(currentFrameData.dataValues[rHandPos[1]])+Number(geometries[2].pos[1])
          rHandRef.current.position.z=Number(currentFrameData.dataValues[rHandPos[2]])*4+Number(geometries[2].pos[2])
          rHandRef.current.rotation.x=Number(currentFrameData.dataValues[rHandRot[0]])*Math.PI/180+Number(geometries[2].rot[0])||0;
          rHandRef.current.rotation.y=Number(currentFrameData.dataValues[rHandRot[1]])*Math.PI/180+Number(geometries[2].rot[1])||0;
          rHandRef.current.rotation.z=Number(currentFrameData.dataValues[rHandRot[2]])*Math.PI/180+Number(geometries[2].rot[2])||0;
        }
        if(lHandRef.current){
          lHandRef.current.position.x=Number(currentFrameData.dataValues[lHandPos[0]])+Number(geometries[1].pos[0])
          lHandRef.current.position.y=Number(currentFrameData.dataValues[lHandPos[1]])+Number(geometries[1].pos[1])
          lHandRef.current.position.z=Number(currentFrameData.dataValues[lHandPos[2]])+Number(geometries[1].pos[2])
          lHandRef.current.rotation.x=Number(currentFrameData.dataValues[lHandRot[0]])*Math.PI/180+Number(geometries[1].rot[0])||0;
          lHandRef.current.rotation.y=Number(currentFrameData.dataValues[lHandRot[1]])*-Math.PI/180+Number(geometries[1].rot[1])||0;
          lHandRef.current.rotation.z=Number(currentFrameData.dataValues[headRot[2]])*-Math.PI/180+Number(geometries[1].rot[2])||0;
        }
      }
    });

    return (
      <>
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 5]} intensity={3} />
        <directionalLight position={[-10, -10, -5]} intensity={1} />
        {/* Cuerpo */}
        {/* Helpers de Drei */}
        <OrbitControls enableZoom={true}>
        </OrbitControls>

        <group position={[0, -0.5, 0]}>
          <Grid position={[0, -0.01, -0.01]} args={gridSize} {...gridConfig} />
          
          <mesh position={geometries[0].pos} ref={headRef} geometry={headModel} rotation={geometries[0].rot} scale={geometries[0].scale}>
            <meshStandardMaterial color={geometries[0].color} />
          </mesh>

          <mesh position={geometries[0].pos} ref={bodyRef} geometry={bodyModel} scale={geometries[0].scale}>
            <meshStandardMaterial color={geometries[0].color} />
          </mesh>

          <mesh position={geometries[0].pos} ref={vrHeadsetRef} geometry={vrHeadsetModel} rotation={geometries[0].rot} scale={geometries[0].scale}>
            <meshStandardMaterial color={"gray"} />
          </mesh>

          <mesh position={geometries[1].pos} ref={lHandRef} geometry={lHandModel} rotation={geometries[1].rot} scale={geometries[1].scale}>
            <meshStandardMaterial color={geometries[1].color} />
          </mesh>

          <mesh position={geometries[2].pos} ref={rHandRef} geometry={rHandModel} rotation={geometries[2].rot} scale={geometries[2].scale}>
            <meshStandardMaterial color={geometries[2].color} />
          </mesh>
        </group>

        <GizmoHelper>
          <GizmoViewport disabled={true} axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
        </GizmoHelper>
        </>
    );
  };
  
  const VideoVariables = () => {
    const handleHideBodyPanel = (index) => {
      var newHideBodyPanel=hideBodyPanel;
      newHideBodyPanel[index]=!newHideBodyPanel[index];
      setHideBodyPanel([...newHideBodyPanel]);
  }
    return (
      <div className="contenedor-secciones">
        <div className="seccion-izquierda" style={{marginLeft: "1%", minHeight: "800px", width:"14%", right:"80%"}}>
          <div>
          <button class="title" onClick={() => handleHideBodyPanel(0)}>↓ Cabeza ↓</button>
          {hideBodyPanel[0]&&(
          <>
          <h3>Posición X</h3>
          <div style={{marginLeft: "10px"}}>
            <select id="dropdown" value={headPos[0]} className='input-parameter' onChange={(e)=>setHeadPos([e.target.value,headPos[1],headPos[2]])}>
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
            <select id="dropdown" value={headPos[1]} className='input-parameter' onChange={(e)=>setHeadPos([headPos[0],e.target.value,headPos[2]])}>
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
            <select id="dropdown" value={headPos[2]} className='input-parameter' onChange={(e)=>setHeadPos([headPos[0],headPos[1],e.target.value])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          <h3>Rotación X</h3>
          <div style={{marginLeft: "10px"}}>
          <select id="dropdown" value={headRot[0]} className='input-parameter' onChange={(e)=>setHeadRot([e.target.value,headRot[1],headRot[2]])}>
            <option value="">Selecciona</option>
            {dataItems.map((dataItem, index) => (
              <option key={index} value={dataItem}>
                {dataItem}
              </option>
            ))}
          </select>
          </div>
          <h3>Rotación Y</h3>
          <div style={{marginLeft: "10px"}}>
          <select id="dropdown" value={headRot[1]} className='input-parameter' onChange={(e)=>setHeadRot([headRot[0],e.target.value,headRot[2]])}>
            <option value="">Selecciona</option>
            {dataItems.map((dataItem, index) => (
              <option key={index} value={dataItem}>
                {dataItem}
              </option>
            ))}
          </select>
          </div>
          <h3>Rotación Z</h3>
          <div style={{marginLeft: "10px"}}>
          <select id="dropdown" value={headRot[2]} className='input-parameter' onChange={(e)=>setHeadRot([headRot[0],headRot[1],e.target.value])}>
            <option value="">Selecciona</option>
            {dataItems.map((dataItem, index) => (
              <option key={index} value={dataItem}>
                {dataItem}
              </option>
            ))}
          </select>
        </div>
        </>
        )}
        </div>
          
        <div>
          <button class="title" onClick={() => handleHideBodyPanel(1)}>↓ Mano Derecha ↓</button>
          {hideBodyPanel[1]&&(
          <>
          <h3>Posición X</h3>
          <div style={{marginLeft: "10px"}}>
            <select id="dropdown" value={rHandPos[0]} className='input-parameter' onChange={(e)=>setRHandPos([e.target.value,rHandPos[1],rHandPos[2]])}>
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
            <select id="dropdown" value={rHandPos[1]} className='input-parameter' onChange={(e)=>setRHandPos([rHandPos[0],e.target.value,rHandPos[2]])}>
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
            <select id="dropdown" value={rHandPos[2]} className='input-parameter' onChange={(e)=>setRHandPos([rHandPos[0],rHandPos[1],e.target.value])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          <h3>Rotación X</h3>
          <div style={{marginLeft: "10px"}}>
          <select id="dropdown" value={rHandRot[0]} className='input-parameter' onChange={(e)=>setRHandRot([e.target.value,rHandRot[1],rHandRot[2]])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          <h3>Rotación Y</h3>
          <div style={{marginLeft: "10px"}}>
          <select id="dropdown" value={rHandRot[1]} className='input-parameter' onChange={(e)=>setRHandRot([rHandRot[0],e.target.value,rHandRot[2]])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          <h3>Rotación Z</h3>
          <div style={{marginLeft: "10px"}}>
          <select id="dropdown" value={rHandRot[2]} className='input-parameter' onChange={(e)=>setRHandRot([rHandRot[0],rHandRot[1],e.target.value])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          </>
          )}
          </div>
          <div>
          <button class="title" onClick={() => handleHideBodyPanel(2)}>↓ Mano Izquierda ↓</button>
          {hideBodyPanel[2]&&(
          <>
          <h3>Posición X</h3>
          <div style={{marginLeft: "10px"}}>
            <select id="dropdown" value={lHandPos[0]} className='input-parameter' onChange={(e)=>setLHandPos([e.target.value,lHandPos[1],lHandPos[2]])}>
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
            <select id="dropdown" value={lHandPos[1]} className='input-parameter' onChange={(e)=>setLHandPos([lHandPos[0],e.target.value,lHandPos[2]])}>
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
            <select id="dropdown" value={lHandPos[2]} className='input-parameter' onChange={(e)=>setLHandPos([lHandPos[0],lHandPos[1],e.target.value])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          <h3>Rotación X</h3>
          <div style={{marginLeft: "10px"}}>
          <select id="dropdown" value={lHandRot[0]} className='input-parameter' onChange={(e)=>setLHandRot([e.target.value,lHandRot[1],lHandRot[2]])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          <h3>Rotación Y</h3>
          <div style={{marginLeft: "10px"}}>
          <select id="dropdown" value={lHandRot[1]} className='input-parameter' onChange={(e)=>setLHandRot([lHandRot[0],e.target.value,lHandRot[2]])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          <h3>Rotación Z</h3>
          <div style={{marginLeft: "10px"}}>
          <select id="dropdown" value={lHandRot[2]} className='input-parameter' onChange={(e)=>setLHandRot([lHandRot[0],lHandRot[1],e.target.value])}>
              <option value="">Selecciona</option>
              {dataItems.map((dataItem, index) => (
                <option key={index} value={dataItem}>
                  {dataItem}
                </option>
              ))}
            </select>
          </div>
          </>
          )}
          </div>
        </div>
      </div>
    )
  }

  return <>
    <h1 class="main-title" style={{position:"fixed", right:"40%"}}>Visualización 3D</h1>
    <Suspense>
      <Canvas gl={{preserveDrawingBuffer:true}} camera={{zoom:0.3}} style={{height:"70%", top:0, position:"fixed", marginLeft:"15%", width:"85%",marginTop:"150px", zIndex:"0", borderColor:"#ebf9fc", borderWidth:"10px", backgroundColor:"#192124"}}>
        <VideoScene/>
      </Canvas>
    </Suspense>
    <VideoVariables/>
    <div style={{height:"100px"}}/>
    <div style={{ bottom: "0", width: "100%", textAlign: "center", position: "fixed", backgroundColor:"white", display: "flex", justifyContent: "center" }}>
      <div style={{width:"40%"}}>
        <h1 class="main-title">Reproducir simulación</h1>
        <div
          style={{
            height: "10px",
            background: "#ccc",
            borderRadius: "5px",
            cursor: "pointer",
            position: "relative",
            margin:"auto"
          }}
          onClick={handleProgressClick}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "blue",
              borderRadius: "5px",
              transition: "width 0.05s ease",
            }}
          ></div>
        </div>*
      </div>
      <div style={{width:"20%"}}>
        <h1 class="main-title">PREVIEW</h1>
        <input type="checkbox" style={{transform: "scale(2)"}} checked={previewActivated} onChange={handlePreview}></input>
      </div>
      <div style={{width:"20%"}}>
        <h1 class="main-title">FPS</h1>
        <input type="number" style={{textAlign: "center", borderColor: "black", borderWidth: "2px", borderRadius: "5px"}} placeholder="FPS (máx. 60)" value={fps} onChange={(e) => handleFps(e.target.value)}></input>
      </div>
      <div>
      <button onClick={handlePlayPause} style={{ fontSize: "40px", marginTop: "10px" }}>
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      </div>
      </div>
    </>
};

export default ModelScene;