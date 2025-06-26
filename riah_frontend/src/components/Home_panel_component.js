import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/User_panel_component.css';
import '../App.css';

function HomePanel() {
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register')
  }

  const handleLogin = () => {
    navigate('/sign-in')
  }

  return (
    <>
    <div className="sub-banner">
      Home
    </div>
    <div class='app'>
        <h1 class="main-title">¡Bienvenid@!</h1>
            <div class="preview-text">
            ¡Bienvenid@ a una versión temprana de RIAH. Esta plataforma le permitirá administrar la información de sus pacientes adquirida mediante la plataforma Rehab-Immersive. Acceda a su lista de pacientes para comenzar su sesión o acceda al panel de administración.
            <br></br>
            <img src={require("../media/RIAH_User_PatientsAspect.png")}></img>
            <br></br>
            <button className="button-patients-list" onClick={handleRegister}>Registrarse</button>
            <button className="button-patients-list" onClick={handleLogin}>Iniciar sesión</button>
        </div>
    </div>
    </>
    )
 }

export default HomePanel;