import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/User_panel_component.css';
import '../App.css';

function User_panel() {
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const handlePatientList = () => {
    navigate('/user/patients-list')
  }

  const handleAdminPanel = () => {
    navigate(process.env.REACT_APP_ADMIN_URL)
  }

  return (
    <>
    <div className="sub-banner">
      <button className="nav-button">Home</button> &gt; 
      Mi panel
    </div>
    <div class='app'>
        <h1 class="main-title">¡Bienvenido Usuario!</h1>
            <div class="preview-text">
            ¡Bienvenid@ a una versión temprana de RIAH. Esta plataforma le permitirá administrar la información de sus pacientes adquirida mediante la plataforma Rehab-Immersive. Acceda a su lista de pacientes para comenzar su sesión o acceda al panel de administración.
            <br></br>
            <img src={require("../media/RIAH_User_PatientsAspect.png")}></img>
            <br></br>
            <button className="button-patients-list" onClick={handlePatientList}>Acceder a mi lista de pacientes</button>
            <button className="button-patients-list" onClick={handleAdminPanel}>{"Acceder al panel de administración (TEMPORAL)"}</button>
        </div>
    </div>
    </>
    )
 }

export default User_panel;