import React from "react";
import { meshPhongMaterial, Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useNavigate, useLocation} from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Suspense } from "react";
import { Grid, Center, Text, GizmoHelper, GizmoViewport,OrbitControls,Line, AccumulativeShadows, RandomizedLight, Environment, Sphere } from '@react-three/drei'

const colorWheel=['#ff0000','#ff4000','#ff8000','#ffbf00','#ffff00','#bfff00','#80ff00','#40ff00','#00ff00','#00ff40','#00ff80','#00ffbf','#00ffff','#00bfff','#0080ff',
  '#0040ff','#0000ff','#4000ff','#8000ff','#bf00ff','#ff00ff','#ff00bf','#ff0080','#ff0040','#ff0000']

const PointsScene = ({dataItems, activeSessionData}) => {

  const [mins, setMins]=useState(null);
  const [maxs,setMaxs]=useState(null);
  const [realMins, setRealMins]=useState(null);
  const [realMaxs, setRealMaxs]=useState(null);
  const desiredScale=30;
  const [startFrame, setStartFrame]=useState(1);
  const [endFrame, setEndFrame]=useState(activeSessionData.frames.length);
  const [pos, setPos]=useState(["","",""]);

  const[normalizedPoints, setNormalizedPoints]=useState([]);

  const [eliminateZeros, setEliminateZeros] = useState(false);
  const [GUIOpacity, setGUIOpacity] = useState(50);
  const [segmentOpacity, setSegmentOpacity] = useState(50);
  const [GUIScale, setGUIScale] = useState(10);
  const [vertexScale, setVertexScale] = useState(10);
  const GUIOpacityTempValue = useRef(50);
  const segmentOpacityTempValue = useRef(50);
  const GUIScaleTempValue = useRef(10);
  const vertexScaleTempValue = useRef(10);

  useEffect(()=>{
    const init = async () => {
      if(pos[0].length>0 && pos[1].length>0 && pos[2].length>0){
        var currentMax=[null,null,null];
        var currentMin=[null,null,null];
        var newNormalizedPoints=[];
        var distanceSum=[0,0,0];

        for(var i=startFrame-1;i<endFrame;i++){
          if(activeSessionData.frames[i]!==undefined){
            var frame=activeSessionData.frames[i].dataValues;
            if(frame.length<2)
              return;
            if(!eliminateZeros || (Number(frame[pos[0]])!==0 && Number(frame[pos[1]])!==0 && Number(frame[pos[2]])!==0)){
              if((currentMax[0]===null || Number(frame[pos[0]])>Number(currentMax[0]))){
                currentMax[0]=Number(frame[pos[0]])
              }if((currentMin[0]===null || Number(frame[pos[0]])<Number(currentMin[0]))){
                currentMin[0]=Number(frame[pos[0]])
              }if((currentMax[1]===null || Number(frame[pos[1]])>Number(currentMax[1]))){
                currentMax[1]=Number(frame[pos[1]])
              }if((currentMin[1]===null || Number(frame[pos[1]])<Number(currentMin[1]))){
                currentMin[1]=Number(frame[pos[1]])
              }if((currentMax[2]===null || Number(frame[pos[2]])>Number(currentMax[2]))){
                currentMax[2]=Number(frame[pos[2]])
              }if((currentMin[2]===null || Number(frame[pos[2]])<Number(currentMin[2]))){
                currentMin[2]=Number(frame[pos[2]])
              }
            }
            distanceSum[0]+=Number(frame[pos[0]]);
            distanceSum[1]+=Number(frame[pos[1]]);
            distanceSum[2]+=Number(frame[pos[2]]);
          }
        }
        
        var dataLength=endFrame-startFrame+1
        console.log(dataLength);

        // Obtain minimum/maximum differences
        var currentFactors=[null,null,null];
        for(i=0;i<currentMax.length;i++){
          currentFactors[i]=(currentMax[i]-currentMin[i]);
        }
        
        for(i=startFrame-1;i<endFrame;i++){
          if(activeSessionData.frames[i]!==undefined){
            var frame=activeSessionData.frames[i].dataValues;
            if(!eliminateZeros || (Number(frame[pos[0]])!==0 && Number(frame[pos[1]])!==0 && Number(frame[pos[2]])!==0)){
              newNormalizedPoints=[...newNormalizedPoints,[
              ((frame[pos[0]]-distanceSum[0]/dataLength) * desiredScale / currentFactors[0]), 
              ((frame[pos[1]]-distanceSum[1]/dataLength) * desiredScale / currentFactors[1]),
              ((frame[pos[2]]-distanceSum[2]/dataLength) * desiredScale / currentFactors[2])]];
              console.log(frame[pos[0]]+" "+i);
            }
          }
        }

        setMins([
          ((currentMin[0]-distanceSum[0]/dataLength) * desiredScale / currentFactors[0]), 
          ((currentMin[1]-distanceSum[1]/dataLength) * desiredScale / currentFactors[1]),
          ((currentMin[2]-distanceSum[2]/dataLength) * desiredScale / currentFactors[2])
        ])
        setMaxs([
          ((currentMax[0]-distanceSum[0]/dataLength) * desiredScale / currentFactors[0]), 
          ((currentMax[1]-distanceSum[1]/dataLength) * desiredScale / currentFactors[1]),
          ((currentMax[2]-distanceSum[2]/dataLength) * desiredScale / currentFactors[2])
        ])
        setRealMins([...currentMin]);
        setRealMaxs([...currentMax]);
        setNormalizedPoints(newNormalizedPoints);
      }
    }
    init();
  },[activeSessionData,pos,eliminateZeros])

  const VideoScene = () => {
    const {camera}=useThree();
    const controlsRef=useRef();

    useEffect(()=>{
      if(maxs!==null){
        camera.position.set(mins[0]+(maxs[0]-mins[0])/2,mins[1]+(maxs[1]-mins[1])/2,maxs[2]+(maxs[1]-mins[1])*1.2);
        controlsRef.current.target.set(mins[0]+(maxs[0]-mins[0])/2,mins[1]+(maxs[1]-mins[1])/2,mins[2]);
        controlsRef.current.update();
      }
    },[maxs, pos, GUIOpacity,segmentOpacity])
    return (
      <>
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 10, 5]} intensity={3}/>
        <directionalLight position={[-10, -10, -5]} intensity={1}/>
        <OrbitControls enableZoom={true} ref={controlsRef}/>

        {pos[0].length>0 && pos[1].length>0 && pos[2].length>0 && activeSessionData.frames.length>1 && normalizedPoints.length>0 && (
        <group position={[0, -0.5, 0]}>
            {normalizedPoints.map((point,index)=>(
              <>
              <Sphere position={point} scale={[vertexScale/100,vertexScale/100,vertexScale/100]}>
                <meshStandardMaterial color="white"/>
              </Sphere>
              <Text position={[point[0],point[1]+(vertexScale/100)*2,point[2]]} color="white" fontSize={GUIScale/100} fillOpacity={GUIOpacity/100}>
                P{(index+1)+" ["+activeSessionData.frames[index].dataValues[pos[0]]+", "+activeSessionData.frames[index].dataValues[pos[1]]+", "+activeSessionData.frames[index].dataValues[pos[2]]+"]"}
              </Text>
              
              {index+1<normalizedPoints.length && (
                <Line
                  points={[point,normalizedPoints[index+1]]}
                  color="white"
                  lineWidth={1}
                  opacity={segmentOpacity/100}
                  segments
                  transparent
                />
              )}
            </>
        ))}
            <>
              <Line
                points={[[maxs[0],mins[1],mins[2]],[maxs[0],mins[1],maxs[2]]]}
                color="white"
                lineWidth={4}
                segments
                />

              <Line
                points={[[mins[0],mins[1],maxs[2]],[mins[0],maxs[1],maxs[2]]]}
                color="white"
                lineWidth={4}
                segments
                />

              <Line
                points={[[mins[0],mins[1],maxs[2]],[maxs[0],mins[1],maxs[2]]]}
                color="white"
                lineWidth={4}
                segments
                />
              </>

            {[...Array(6)].map((x, i) =>
            <>
              <Line
              points={[[mins[0]+(maxs[0]-mins[0])/5*(i),mins[1],mins[2]],[mins[0]+(maxs[0]-mins[0])/5*(i),mins[1],maxs[2]]]}
              color="#444444"
              lineWidth={2}
              />

              <Line
              points={[[mins[0],mins[1]+(maxs[1]-mins[1])/5*(i),mins[2]],[mins[0],mins[1]+(maxs[1]-mins[1])/5*(i),maxs[2]]]}
              color="#444444"
              lineWidth={2}
              />

              <Line
              points={[[mins[0]+(maxs[0]-mins[0])/5*(i),mins[1],mins[2]],[mins[0]+(maxs[0]-mins[0])/5*(i),maxs[1],mins[2]]]}
              color="#444444"
              lineWidth={2}
              />

              <Line
              points={[[mins[0],mins[1],mins[2]+(maxs[2]-mins[2])/5*(i)],[mins[0],maxs[1],mins[2]+(maxs[2]-mins[2])/5*(i)]]}
              color="#444444"
              lineWidth={2}
              />

              <Line
              points={[[mins[0],mins[1]+(maxs[1]-mins[1])/5*(i),mins[2]],[maxs[0],mins[1]+(maxs[1]-mins[1])/5*(i),mins[2]]]}
              color="#444444"
              lineWidth={2}
              />

              <Line
              points={[[mins[0],mins[1],mins[2]+(maxs[2]-mins[2])/5*(i)],[maxs[0],mins[1],mins[2]+(maxs[2]-mins[2])/5*(i)]]}
              color="#444444"
              lineWidth={2}
              />

            <Text position={[maxs[0]+(maxs[0]-mins[0])/10,mins[1],mins[2]+(maxs[2]-mins[2])/5*(i)]} color="white" fontSize={1}>
              { Math.floor((realMins[2]+(realMaxs[2]-realMins[2])/5*(i))*10000)/10000}
            </Text>

            <Text position={[mins[0]-(maxs[2]-mins[2])/10,mins[1]+(maxs[1]-mins[1])/5*(i),maxs[2]]} color="white" fontSize={1}>
              { Math.floor((realMins[1]+(realMaxs[1]-realMins[1])/5*(i))*10000)/10000}
            </Text>

            <Text position={[mins[0]+(maxs[0]-mins[0])/5*(i),mins[1],maxs[2]+(maxs[2]-mins[2])/10]} color="white" fontSize={1}>
              { Math.floor((realMins[0]+(realMaxs[0]-realMins[0])/5*(i))*10000)/10000}
            </Text>
            </>
          )}
        </group>
        )}

        <GizmoHelper>
          <GizmoViewport disabled={true} axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
        </GizmoHelper>
      </>
    ); 
  };
    const VideoVariables = () => {

    const handleGUIOChange = (e) => {
      GUIOpacityTempValue.current = e.target.value;
    };

    const handleGUIORelease = () => {
      setGUIOpacity(GUIOpacityTempValue.current);
    };

    const handleSOChange = (e) => {
      segmentOpacityTempValue.current = e.target.value;
    };

    const handleSORelease = () => {
      setSegmentOpacity(segmentOpacityTempValue.current);
    };

    const handleGUISChange = (e) => {
      GUIScaleTempValue.current = e.target.value;
    };

    const handleGUISRelease = () => {
      setGUIScale(GUIScaleTempValue.current);
    };

    const handleVSChange = (e) => {
      vertexScaleTempValue.current = e.target.value;
    };

    const handleVSRelease = () => {
      setVertexScale(vertexScaleTempValue.current);
    };

    const handleEliminateZeros = () => {
      setEliminateZeros(!eliminateZeros);
    };

    return (
      <div style={{alignSelf:"center"}}>
        <div className="seccion-izquierda" style={{alignSelf:"center"}}>
          <div>
          <>
          <h3>Parámetro X</h3>
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
          <h3>Parámetro Y</h3>
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
          <h3>Parámetro Z</h3>
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
          <div style={{ width: "300px" }}>
            <label>Opacidad del texto | {GUIOpacity}</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={GUIOpacity}
              onChange={handleGUIOChange}
              onMouseUp={handleGUIORelease}
              onTouchEnd={handleGUIORelease}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ width: "300px" }}>
            <label>Opacidad del segmento | {segmentOpacity}</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={segmentOpacity}
              onChange={handleSOChange}
              onMouseUp={handleSORelease}
              onTouchEnd={handleSORelease}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ width: "300px" }}>
            <label>Tamaño del texto | {GUIScale}</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={GUIScale}
              onChange={handleGUISChange}
              onMouseUp={handleGUISRelease}
              onTouchEnd={handleGUISRelease}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ width: "300px" }}>
            <label>Tamaño del vértice | {vertexScale}</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={vertexScale}
              onChange={handleVSChange}
              onMouseUp={handleVSRelease}
              onTouchEnd={handleVSRelease}
              style={{ width: "100%" }}
            />
          </div>
          <h3>Sustraer ceros</h3>
          <div style={{marginLeft: "10px"}}>
            <input type="checkbox" checked={eliminateZeros} onChange={handleEliminateZeros}>
            
            </input>
          </div>
          </>
          </div>
        </div>
      </div>
    )
  }

  return(
  <div style={{justifyItems: "center", display:"flex", width:"80%"}}>
    <VideoVariables/>
    <Suspense>
      <Canvas gl={{preserveDrawingBuffer:true}} camera={{zoom:0.3, fov:20}} style={{ marginLeft:"20px", height:"500px", position:"relative", alignSelf:"center", backgroundColor:"#192124"}}>
        <VideoScene/>
      </Canvas>
    </Suspense>
  </div>
  );
}

export default PointsScene;