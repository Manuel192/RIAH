import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from "./VideoPlayer";
import '../css/CreateSessionComponent.css';
import "../App.css";

function SignIn({redirect,userID=""}) {
    const location=useLocation();
    const navigate=useNavigate();

    // Tratamos con una aplicación de gestión médica: se toman únicamente en cuenta los géneros biológicos sin afán de ofender a los colectivos no binarios.
    const genders=["Masculino","Femenino","NA"];
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

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
        var errorDetected=false;

        setErrorEmail("")
        setErrorPassword("")
        if(!email){
            setErrorEmail("Rellene el campo \"Correo electrónico\".")
            errorDetected=true;
        }
        if(!password){
            setErrorPassword("Rellene el campo \"Contraseña\".")
            errorDetected=true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            setErrorEmail("El formato del correo electrónico no es válido.");
            errorDetected=true;
        }

        if(errorDetected){
            return;
        }

        try {
            const responsePatient=await fetch(process.env.REACT_APP_GENERAL_URL+'/user/loginPatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });
            if(responsePatient.ok){
                const userID=await responsePatient.text();
                const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/createPatientToken?id="+userID);
                const token = await responseToken.text();
                sessionStorage.setItem("token", token);
                navigate('/patient');
            }else{
                if(responsePatient.status===429){
                    setErrorPassword("Has realizado demasiados intentos. Prueba a iniciar sesión más tarde.");
                    return;
                }
            }
            const responseTherapist=await fetch(process.env.REACT_APP_GENERAL_URL+'/user/loginTherapist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
            })
            if(responseTherapist.ok){
                const userID=await responseTherapist.text();
                const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/createTherapistToken?id="+userID);
                const token = await responseToken.text();
                sessionStorage.setItem("token", token);
                navigate("/therapist/patients-list");
            }
            const responseAdmin=await fetch(process.env.REACT_APP_GENERAL_URL+'/user/loginAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
            })
            if(responseAdmin.ok){
                const userID=await responseAdmin.text();
                const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/createAdminToken?id="+userID);
                const token = await responseToken.text();
                sessionStorage.setItem("token", token);
                navigate("/admin");
            }else
                setErrorPassword("El correo o la contraseña no son correctos. Asegúrese de rellenarlos correctamente.");
        } catch (error) {
            alert(error);
        }
    }

    const handleSetEmail = (value) => {
        setEmail(value.toLowerCase());
    }

    const handleForgottenPassword = () => {
        
    }

    const handleRegister = () => {
        navigate('/register')
    }

    return (
    <>
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
                    {errorEmail&&(
                        <label className="font-semibold text-red-600 text-left">{errorEmail}</label>
                    )}
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
                    {errorPassword&&(
                            <label className="font-semibold text-red-600 text-left">{errorPassword}</label>
                        )}
                    <br></br>
                    <br></br>
                    <button className="font-semibold text-blue-300 hover:underline text-left" onClick={handleForgottenPassword}>Olvidé mi contraseña</button>
                    <button className="font-semibold text-blue-300 hover:underline text-left" onClick={handleRegister}>¿No tienes una cuenta? Crear una cuenta</button>
                    <button className="button-create-session" onClick={verifyCode}>Iniciar sesión</button>
                </div>
             </div>
        </div>
        </>
    );
}

export default SignIn;