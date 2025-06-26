import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingScreen from "./loading_screen";
import '../css/Create_session_component.css';
import "../App.css";
import "../css/loading_screen.css"
import "../css/Register_component.css"

function Register({redirect,setUser}) {
    const location=useLocation();
    const navigate=useNavigate();

    // Tratamos con una aplicación de gestión médica: se toman únicamente en cuenta los géneros biológicos sin afán de ofender a los colectivos no binarios.
    const genders=["Masculino","Femenino","NA"];
  
    const [hospitals, setHospitals] = useState([]);
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [hospital, setHospital] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [isLoading, setIsLoading]= useState(false);

    const [errors, setErrors] = useState([]);

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
        var errorList=[];
        var errorDetected=false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name === '') {
            errorList.push('El campo "Nombre" está vacío.');
            errorDetected = true;
        }
        if (gender === '') {
            errorList.push('El campo "Género" está vacío.');
            errorDetected = true;
        }
        if (hospital === '') {
            errorList.push('El campo "Hospital" está vacío.');
            errorDetected = true;
        }

        if (!emailRegex.test(email)) {
            errorList.push("El formato del correo electrónico no es válido.");
            errorDetected = true;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            errorList.push("La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &).");
            errorDetected = true;
        }
        if (repeatPassword === '') {
            errorList.push('El campo "Repetir contraseña" está vacío.');
            errorDetected = true;
        }
        if (password !== repeatPassword) {
            errorList.push("Las contraseñas no coinciden.");
            errorDetected = true;
        }

        setErrors(errorList);

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
                    navigate('/register-2fa');
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

    const handleHomePanel = () => {
        navigate('/')
    }

    const handleCloseErrors = () => {
        setErrors([]);
    }

    return (
    <>
    {errors.length>0&&(
            <>
            <div class="error-overlay">
                <div class="rectangle error-panel">
                    <h1 class="main-title">Revise los siguientes errores:</h1>
                    {errors.map(error=>(
                        <div class="error-panel-content">
                            <label>* {error}</label>
                        </div>
                    ))}
                    <div >
                        <button className="button-error" onClick={handleCloseErrors}>Aceptar</button>
                    </div>
                </div>
            </div>
            </>
        )}
        <LoadingScreen isLoading={isLoading} text={"Verificando registro..."} isFixed={true} />
        <div className="sub-banner">
            <button className="nav-button" onClick={handleHomePanel}>Home</button> &gt;
            Registrarse
        </div>
        <div class="app">
            <h3 class="main-title">Registrarse</h3>
            <div class="rectangle">
                <div class="create-session">
                    <div class="create-session-section">
                        <h3 class="title">Nombre completo</h3>
                        <input 
                            value={name} 
                            placeholder="Nombre completo"
                            onChange={(e) => setName(e.target.value)} 
                            className="create-session-field" 
                        />
                    </div>
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
                            <img src={require("../media/RIAH_hide.png")} style={{width:"30px"}}></img>
                            :
                            <img src={require("../media/RIAH_show.png")} style={{width:"30px"}}></img>
                            }
                        </button>
                    </div>
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
                    <button className="button-register" onClick={registerUser}>Registrarse</button>
                </div>
             </div>
        </div>
        </>
    );
}

export default Register;