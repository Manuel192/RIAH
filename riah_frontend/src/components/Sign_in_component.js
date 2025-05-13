import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from "./video_player";
import '../css/Create_session_component.css';
import "../App.css";
import { addAfterEffect } from "@react-three/fiber";

function SignIn() {
    const location=useLocation();
    const navigate=useNavigate();

    // Tratamos con una aplicación de gestión médica: se toman únicamente en cuenta los géneros biológicos sin afán de ofender a los colectivos no binarios.
    const genders=["Masculino","Femenino","NA"];
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleUserPanel = () => {
    navigate('/user')
    }

    return (
    <>
        <div className="sub-banner">
            <button className="nav-button">Home</button> &gt;
            Iniciar sesión
        </div>
        <div class="app">
            <h3 class="main-title">Iniciar sesión</h3>
            <div class="rectangle">
                <div class="create-session">
                    <div class="create-session-section">
                        <h3 class="title">Correo electrónico</h3>
                        <input 
                            value={email} 
                            placeholder="Correo electrónico"
                            onChange={(e) => setEmail(e.target.value)} 
                            className="create-session-field" 
                        />
                    </div>
                    <div class="create-session-section">
                        <h3 class="title">Contraseña</h3>
                        <input
                            type={showPassword?"text":"password"}
                            value={password} 
                            placeholder="Contraseña"
                            onChange={(e) => setPassword(e.target.value)} 
                            className="create-session-field" 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ?
                            <img src={require("../media/RIAH_hide.png")} style={{width:"30px", marginTop:"50%"}}></img>
                            :
                            <img src={require("../media/RIAH_show.png")} style={{width:"30px", marginTop:"50%"}}></img>
                            }
                        </button>
                    </div>
                    <button className="button-create-session">Iniciar sesión</button>
                </div>
             </div>
        </div>
        </>
    );
}

export default SignIn;