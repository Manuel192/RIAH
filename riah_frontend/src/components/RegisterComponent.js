import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingScreen from "./LoadingScreen";
import '../css/CreateSessionComponent.css';
import "../App.css";
import "../css/LoadingScreen.css"
import "../css/RegisterComponent.css"

function Register({redirect,setUser}) {
    const location=useLocation();
    const navigate=useNavigate();

    // Tratamos con una aplicación de gestión médica: se toman únicamente en cuenta los géneros biológicos sin afán de ofender a los colectivos no binarios.
    const genders=["Masculino","Femenino","NA"];
    const userTypes = ["Paciente","Terapeuta","Administrador"]
    const [hospitals, setHospitals] = useState([]);
    
    const [name, setName] = useState("");
    const [userType, setUserType] = useState("");
    const [gender, setGender] = useState("");
    const [hospital, setHospital] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [errorHospitals, seterrorHospitals] = useState([]);
    const [errorName, seterrorName] = useState("");
    const [errorUserType, seterrorUserType] = useState("");
    const [errorGender, seterrorGender] = useState("");
    const [errorHospital, seterrorHospital] = useState("");
    const [errorEmail, seterrorEmail] = useState("");
    const [errorPassword, seterrorPassword] = useState("");
    const [errorRepeatPassword, seterrorRepeatPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [isLoading, setIsLoading]= useState(false);

    useEffect(()=>{
        const init = async () => {
            await redirect();
            try{
                const responseHospitals = await fetch(process.env.REACT_APP_GENERAL_URL+"/hospital/loadHospitals");
                if(!responseHospitals.ok){
                return;
                }
                // convert data to json
                const hospitalsParsed = await responseHospitals.json();
                setHospitals(hospitalsParsed);
            }catch(error){
            
            }
        }
        init();
    }, [])

    const registerUser = async () => {

        var errorDetected=false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        seterrorName("");
        seterrorGender("");
        seterrorUserType("");
        seterrorHospital("");
        seterrorEmail("");
        seterrorPassword("");
        seterrorRepeatPassword("");
        
        if (!name) {
            seterrorName("Rellene el campo \"Nombre de usuario\".")
            errorDetected = true;
        }
        if (!userType) {
            seterrorUserType("Rellene el campo \"Tipo de usuario\".")
            errorDetected = true;
        }
        if (!gender) {
            seterrorGender("Rellene el campo \"Género\".")
            errorDetected = true;
        }

        if (!hospital) {
            seterrorHospital("Rellene el campo \"Hospital\".")
            errorDetected = true;
        }

        if(!email){
            seterrorEmail("Rellene el campo \"Correo electrónico\".")
            errorDetected=true;
        }
        if(!password){
            seterrorPassword("Rellene el campo \"Contraseña\".")
            errorDetected=true;
        }

        if (email && !emailRegex.test(email)) {
            seterrorEmail("El formato del correo electrónico no es válido.");
            errorDetected = true;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (password && !passwordRegex.test(password)) {
            seterrorPassword("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &).");
            errorDetected = true;
        }
        if (!repeatPassword) {
            seterrorRepeatPassword("Rellene el campo \"Repetir contraseña\".")
            errorDetected = true;
        }
        if (repeatPassword && password !== repeatPassword) {
            seterrorRepeatPassword("Las contraseñas no coinciden.");
            errorDetected = true;
        }

        if(errorDetected!==true){
            try {
                setIsLoading(true);
                const response=await fetch(process.env.REACT_APP_GENERAL_URL+'/user/doubleFactor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name, gender:gender, hospital: hospital, email:email, password: password }),
                });
                if(response.ok){
                    const responseUserID=await response.text();
                    setUser(responseUserID);
                    navigate('/register-2fa', {state:{role:userType, extraParameters:hospital}});
                }
                else{
                    const error=await response.text()
                    setIsLoading(false);
                    seterrorRepeatPassword(error);
                }
        } catch (error) {
            alert(error);
        }
        }
    }

    const handleHospitalChanged = (event) =>{
        setHospital(event.target.value);
    }

    const handleGenderChanged = (event) =>{
        setGender(event.target.value);
    }

    const handleUserTypeChanged = (event) =>{
        setUserType(event.target.value);
    }

    const handleHomePanel = () => {
        navigate('/')
    }

    return (
    <>
        <LoadingScreen isLoading={isLoading} text={"Verificando registro..."} isFixed={true} />
        <div className="sub-banner">
            <button className="nav-button" onClick={handleHomePanel}>Home</button> &gt;
            Registrarse
        </div>
        <div class="app">
            <h3 class="main-title">Crear una cuenta</h3>
            <div class="rectangle">
                <div class="create-session">
                    <div class="create-session-section">
                        <h3 class="title">Nombre de usuario</h3>
                        <input 
                            value={name} 
                            placeholder="Nombre completo"
                            onChange={(e) => setName(e.target.value)} 
                            className="create-session-field" 
                        />
                    </div>
                    {errorName&&(
                        <label className="font-semibold text-red-600 text-left">{errorName}</label>
                    )}
                    <div class="create-session-section">
                        <h3 class="title">Tipo de usuario</h3>
                        <select id="dropdown" value={userType} className="create-session-field" onChange={handleUserTypeChanged}>
                        <option value="" disabled="true">Selecciona un tipo de usuario</option>
                            {userTypes?.map((option, index) => (
                                <option key={index} value={option}>
                                {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errorUserType&&(
                        <label className="font-semibold text-red-600 text-left">{errorUserType}</label>
                    )}
                    <div class="create-session-section">
                        <h3 class="title">Género</h3>
                        <select id="dropdown" value={gender} className="create-session-field" onChange={handleGenderChanged}>
                        <option value="" disabled="true">Selecciona un género</option>
                            {genders?.map((option, index) => (
                                <option key={index} value={option}>
                                {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errorGender&&(
                        <label className="font-semibold text-red-600 text-left">{errorGender}</label>
                    )}
                    <div class="create-session-section">
                        <h3 class="title">Hospital</h3>
                        <select id="dropdown" value={hospital} className="create-session-field" onChange={handleHospitalChanged}>
                        <option value="" disabled="true">Selecciona un hospital</option>
                            {hospitals?.map((option, index) => (
                                <option key={index} value={option.id}>
                                {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errorHospital&&(
                        <label className="font-semibold text-red-600 text-left">{errorHospital}</label>
                    )}
                    <div class="create-session-section">
                        <h3 class="title">Correo electrónico</h3>
                        <input 
                            value={email} 
                            placeholder="Correo electrónico"
                            onChange={(e) => setEmail(e.target.value)} 
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
                            <img src={require("../media/RIAH_hide.png")} style={{width:"30px"}}></img>
                            :
                            <img src={require("../media/RIAH_show.png")} style={{width:"30px"}}></img>
                            }
                        </button>
                    </div>
                    {errorPassword&&(
                            <label className="font-semibold text-red-600 text-left">{errorPassword}</label>
                        )}
                    <div class="create-session-section">
                        <h3 class="title">Repetir contraseña</h3>
                        <input 
                            type={showRepeatPassword?"text":"password"}
                            value={repeatPassword} 
                            placeholder="Repetir contraseña"
                            onChange={(e) => setRepeatPassword(e.target.value)} 
                            className="create-session-field"
                        />
                        <button
                            type="button"
                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            >
                            {showRepeatPassword ?
                            <img src={require("../media/RIAH_hide.png")} style={{width:"30px"}}></img>
                            :
                            <img src={require("../media/RIAH_show.png")} style={{width:"30px"}}></img>
                            }
                        </button>
                    </div>
                    {errorRepeatPassword&&(
                            <label className="font-semibold text-red-600 text-left">{errorRepeatPassword}</label>
                        )}
                    <button className="button-register" onClick={registerUser}>Registrarse</button>
                </div>
             </div>
        </div>
        </>
    );
}

export default Register;