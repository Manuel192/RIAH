import './App.css';
import Register from './components/Register_component';
import Register2FA from './components/Register_2FA_component';
import SignIn from './components/Sign_in_component';
import HomePanel from './components/Home_panel_component';
import Create_session from './components/Create_session_component';
import Evolution from './components/Evolution_component';
import Patients_list from './components/Patients_list_component';
import Raw_data from "./components/Raw_data_component"
import ModelScene from './components/3DModelScene';
import PointsScene from './components/3DPointsScene';
import Create_Patient from './components/Create_patient_component';
import { useNavigate } from 'react-router-dom';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Admin from './components/Admin_component';

function App() {
  const navigate=useNavigate();

  const [userID, setUserID] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePanel = () => {
    navigate('/');
  }

  const RedirectRoute = async () => {
      if(sessionStorage.getItem("token")){
        const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkUserToken?token="+sessionStorage.getItem("token"));
        if(responseToken.ok){
          navigate("/user/patients-list");
        }
        const responseToken2 = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkAdminToken?token="+sessionStorage.getItem("token"));
        if(responseToken2.ok){
          navigate(process.env.REACT_APP_ADMIN_URL);
        }
    }
  };

  const ProtectedUserRoute = async () => {
      if(sessionStorage.getItem("token")){
        const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkUserToken?token="+sessionStorage.getItem("token"));
        if(!responseToken.ok){
          navigate("/");
        }else{
          const newUserID = await responseToken.text();
          setUserID(newUserID)
          return newUserID;
        }
      }
    }

  const ProtectedAdminRoute = async () => {
      if(sessionStorage.getItem("token")){
        const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkAdminToken?token="+sessionStorage.getItem("token"));
        if(!responseToken.ok){
            navigate("/");
          }
      }
    };
  
  const handleShowCloseSession = () => {
    setMenuOpen(!menuOpen);
  }

  const handleCloseSession = () => {
    setMenuOpen(false);
    setUserID("");
    sessionStorage.setItem("token", "");
    navigate("/");
  }
  
  return (
    <div className="App">
       <header className="header">
        <div className="left-section">
          <img src={require('./media/RIAH_default_icon.png')} width={60} alt="Logo" className="logo" />
          <h1 className="title">&nbsp;RIAH</h1>
        </div>
        {userID &&(
        <div className="right-section">
          <button className="nav-button">Rehab-Immersive</button>
          <button className="nav-button">Sobre Nosotros</button>
          <button className="nav-button" onClick={handlePanel}>Mi panel</button>
          <button onClick={handleShowCloseSession}>
            <img src={require('./media/RIAH_profile.png')} alt="Profile" className="profile-pic" />
          </button>
        </div>
        )}
      </header>
      {menuOpen && (
        <div class="rectangle close-session-panel">
          <button class="close-session" onClick={handleCloseSession}>Cerrar sesión</button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePanel />} />
        <Route path="/register" element={<Register redirect={()=>RedirectRoute()} setUser={(user)=>setUserID(user)}/>} />
        <Route path="/register-2fa" element={<Register2FA redirect={()=>RedirectRoute()} userID={userID}/>} />
        <Route path="/sign-in" element={<SignIn redirect={()=>RedirectRoute()} userID={userID}/>} />
        <Route path="/user/3d-model" element={ <ModelScene redirect={()=>ProtectedUserRoute()}/>} />
        <Route path="/user/3d-points" element={<PointsScene redirect={()=>ProtectedUserRoute()}/>} />
        <Route path="/user/patients-list" element={ <Patients_list redirect={()=>ProtectedUserRoute()} userID={userID}/>} />
        <Route path="/user/raw-data" element={ <Raw_data redirect={()=>ProtectedUserRoute()}/>} />
        <Route path="/user/evolution" element={ <Evolution redirect={()=>ProtectedUserRoute()}/>} />
        <Route path="/user/create-session" element={ <Create_session redirect={()=>ProtectedUserRoute()}/>} />
        <Route path="/user/create-patient" element={ <Create_Patient  redirect={()=>ProtectedUserRoute()} userID={userID}/>} />
        <Route path="/admin" element={<Admin redirect={()=>ProtectedAdminRoute()} />} />
        <Route path="*" element={<HomePanel/>}/>
      </Routes>
      <div className="rights-sub-banner">
        &copy; 2024 Grupo AIR - Todos los derechos reservados
      </div>
    </div>

  );
}

export default App;
