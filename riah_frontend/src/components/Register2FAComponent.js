import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from "./VideoPlayer";
import '../css/CreateSessionComponent.css';
import '../css/2FA.css';
import "../App.css";

function Register2FA({redirect, userID=""}) {
    const location=useLocation();
    const navigate=useNavigate();

    const {role, extraParameters}=location.state || {};
  
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
        try {
            const response=await fetch(process.env.REACT_APP_GENERAL_URL+'/user/insertUser?code='+totalCode+"&role="+role, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: {id:userID, hospital:extraParameters}}),
            });
            if(response.ok){
                const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/createToken?id="+userID+"&role="+role);
                const token = await responseToken.text();
                sessionStorage.setItem("token", token);
                navigate('/register-completed');
            }else{
                if(response.status===429){
                    alert("Has realizado demasiados intentos. Este registro queda invalidado. Prueba a registrarte más tarde");
                    return;
                }
                alert("El código introducido no es correcto o ha expirado. Por favor, repita la operación o modifique el registro.");
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