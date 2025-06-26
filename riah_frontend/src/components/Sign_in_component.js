import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from "./video_player";
import '../css/Create_session_component.css';
import "../App.css";

function SignIn({redirect,userID=""}) {
    const location=useLocation();
    const navigate=useNavigate();

    // Tratamos con una aplicación de gestión médica: se toman únicamente en cuenta los géneros biológicos sin afán de ofender a los colectivos no binarios.
    const genders=["Masculino","Femenino","NA"];
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    useEffect(()=>{
        const init = async () => {
            userID=await redirect();
        }
        init();
    },[])

    const handleHomePanel = () => {
        navigate('/')
    }

    const verifyCode = async () => {
        if(!email || !password){
            setError("Rellene los campos antes de Correo electrónico y Contraseña antes de iniciar sesión.")
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("El formato del correo electrónico no es válido.");
            return;
        }

        try {
            const response=await fetch(process.env.REACT_APP_GENERAL_URL+'/user/loginUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });
            if(response.ok){
                const userID=await response.text();
                const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/createUserToken?id="+userID);
                const token = await responseToken.text();
                sessionStorage.setItem("token", token);
                navigate('/user/patients-list');
            }else{
                const responseAdmin=await fetch(process.env.REACT_APP_GENERAL_URL+'/user/loginAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
                })
                if(responseAdmin.ok){
                    const userID=await response.text();
                    const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/createAdminToken?id="+userID);
                    const token = await responseToken.text();
                    sessionStorage.setItem("token", token);
                    navigate("/admin");
                }else
                    setError("El correo o la contraseña no son correctos. Asegúrese de rellenarlos correctamente.");
            }
        } catch (error) {
            alert(error);
        }
    }

    const handleSetEmail = (value) => {
        setEmail(value.toLowerCase());
    }

    const handleCloseError = () => {
        setError(false);
    }

    return (
    <>
        {error && (
            <>
            <div class="error-overlay">
                <div class="rectangle error-panel-login ">
                    <h1 class="main-title">Revise los siguientes errores:</h1>
                    <div class="error-panel-content">
                        <label>* {error}</label>
                    </div>
                    <div >
                        <button className="button-error" onClick={handleCloseError}>Aceptar</button>
                    </div>
                </div>
            </div>
            </>
        )}
        <div className="sub-banner">
            <button className="nav-button" onClick={handleHomePanel}>Home</button> &gt;
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
                            onChange={(e) => handleSetEmail(e.target.value)} 
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
                    <button className="button-create-session" onClick={verifyCode}>Iniciar sesión</button>
                </div>
             </div>
        </div>
        </>
    );
}

export default SignIn;