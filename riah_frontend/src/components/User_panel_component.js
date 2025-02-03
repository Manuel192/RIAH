import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import { height } from '@mui/system';

function User_panel() {
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handlePatientList = () => {
    navigate('/patients-list', { state: {user:"cb7c8009-b7c0-11ef-bbaf-e4e749429566"}})
  }

  return (
    <>
    <div className="sub-banner">
      <button className="nav-button">Home</button> &gt; 
      Mi panel
    </div>
    <div class='app'>
        <h1>Mi panel</h1>
            <div class="preview-text">
            ¡Hola, bienvenid@ a la versión preliminar de RIAH! Este es el panel temporal que simulará lo que un usuario ve cuando
            <br/>
            ingresa a la aplicación, dado que el sistema de usuarios no será incluido hasta fases más avanzadas del proyecto.
            <br/>
            Espero que esta versión temprana le sea de utilidad para observar las funcionalidades que el futuro sistema RIAH
            <br/>
            le permitirá hacer. Cualquier comentario será de utilidad para un mejor resultado final.
            <br/>
            <button className="button-patients-list" onClick={handlePatientList}>Lista de pacientes</button>
        </div>
    </div>
    </>
    )
 }

export default User_panel;