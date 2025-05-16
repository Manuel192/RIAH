import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from "./video_player";
import '../css/Create_session_component.css';
import '../css/2FA.css';
import "../App.css";
import { addAfterEffect } from "@react-three/fiber";

function Register2FA({redirect, userID=""}) {
    const location=useLocation();
    const navigate=useNavigate();
  
    const [code, setCode] = useState(["","","","","",""]);

    useEffect(()=>{
        const init = async () => {
            await redirect();
            if(!userID)
                navigate("/");
        }
        init();
    },[])

    const handleSetCode = (value, index) => {
        if(value.length<2 && !isNaN(value)){
            var newCode=code;
            newCode[index]=value;
            setCode([...newCode]);
            console.log(newCode);
        }   
    }

    const verifyCode = async () => {
        var totalCode="";
        for(var i=0;i<code.length;i++){
            if(code[i].isNaN){
                alert("Introduzca todos los dígitos del código.");
                return;
            }
            else{
                totalCode+=code[i];
            }
        }
        console.log(totalCode);
        try {
            const response=await fetch(process.env.REACT_APP_GENERAL_URL+'/user/insertUser?code='+totalCode, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: userID }),
            });
            if(response.ok){
                const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/createUserToken?id="+userID);
                const token = await responseToken.text();
                sessionStorage.setItem("token", token);
                navigate('/user/patients-list');
            }else{
                alert(await response.text());
            }
        } catch (error) {
            alert(error);
        }
    }

    const handleHomePanel = () => {
        navigate('/')
    }

    return (
    <>
        <div className="sub-banner">
            <button className="nav-button" onClick={handleHomePanel}>Home</button> &gt;
            Registrarse
        </div>
        <div class="app">
            <h3 class="main-title">CÓDIGO DE VERIFICACIÓN</h3>
            <div class="rectangle code-align">
                <label class="secondfactor-description-text">{"Le hemos enviado un correo electrónico para verificar que es usted quien posee el correo especificado. "+
                "Revise su correo y escriba a continuación el código especificado en él (no olvide mirar en la sección de SPAM)."}
                </label>
                <div class="code">
                {code.map((digit, index)=>(
                    <input 
                        value={digit} 
                        placeholder="0"
                        onChange={(e) => handleSetCode(e.target.value, index)} 
                        className="digit-input" 
                    />
                    ))}
                </div>
                <button className="button-create-session" onClick={verifyCode}>Verificar</button>
            </div>
        </div>
        </>
    );
}

export default Register2FA;