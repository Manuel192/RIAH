"use client"
import React, { useState, useEffect } from "react";
import { AreaChart, BarChart, Card} from "@tremor/react";
import '../css/EvolutionComponent.css';
import "../App.css";

const Versions = ({redirect}) => {

  const [games, setGames]=useState([]);
  const [versions, setVersions]=useState([]);

const handleDownload = async (apkName) => {
  window.open(process.env.REACT_APP_SESSIONS_URL+`/apk/download/${apkName}`, "_blank");
};

useEffect(() => {
    const init = async () => {
      try{
        const responseGames = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/loadGames?token="+sessionStorage.getItem("token"));
        if(!responseGames.ok){
          setGames([]);
          return;
        }

        const gamesParsed = await responseGames.json();
        setGames(gamesParsed);

        const responseVersions = await fetch(process.env.REACT_APP_GENERAL_URL+"/game/loadVersions?token="+sessionStorage.getItem("token"));
        if(!responseVersions.ok){
          setVersions([]);
          return;
        }

        const versionsParsed = await responseVersions.json();
        var structuredVersions = [];
        for(var i=0;i<gamesParsed.length;i++){
          structuredVersions.push({id:gamesParsed[i].id,data:versionsParsed.filter(v=>v.game===gamesParsed[i].id)});
        }
        console.log(structuredVersions);
        setVersions(structuredVersions);
      }catch(error){
        console.log(error);
      }
    }
    init();
  }, []);

return (
  <>
  {/* Pantalla de carga */}
  <div div class="app">
  <div className="evolution-container">
    <h1 class="main-title">Mosaico de versiones</h1>
    <div class="graphs">
      {games.map(game=>(
        <Card className="tremor-Card">
          <h3 class="title">{game.name}</h3>
          <img style={{margin:"auto", width:"1000px"}} src={process.env.REACT_APP_SESSIONS_URL+`/image/${game.thumbnail}`}></img>
          <div className="long-scrollable-list" id="scrollable-list">
            {versions.filter(v=>(v.id===game.id))[0]?.data.map(version=>(
              <div onClick={()=>handleDownload(game.name+"_"+version.name)}
                className={`list-item`} style={{fontWeight:"bold", fontSize:"30px", display:"flex"}}>
                {version.name}
                <img style={{marginRight:"0px", width:"40px"}}src={require("../media/DownloadIcon.png")}></img>
              </div>
              ))}
            </div>
          </Card>
        ))}
    </div>
    </div>
    </div>
  </>
  );
};

export default Versions;
