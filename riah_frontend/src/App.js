import './App.css';
import Register from './components/RegisterComponent';
import Register2FA from './components/Register2FAComponent';
import SignIn from './components/SignInComponent';
import HomePanel from './components/HomePanelComponent';
import CreateSession from './components/CreateSessionComponent';
import Evolution from './components/EvolutionComponent';
import Patients_list from './components/PatientsListComponent';
import Raw_data from "./components/RawDataComponent"
import ModelScene from './components/3DModelScene';
import RegisterCompleted from './components/RegisterCompletedComponent';
import Patient_view from './components/PatientViewController';
import { useNavigate } from 'react-router-dom';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Admin from './components/AdminComponent';
import Versions from './components/VersionsComponent';

function App() {
  const navigate=useNavigate();

  const [userID, setUserID] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePanel = () => {
    navigate('/');
  }

  const RedirectRoute = async () => {
      if(sessionStorage.getItem("token")){
        const responsePatientToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkPatientToken?token="+sessionStorage.getItem("token"));
        if(responsePatientToken.ok){
          navigate("/patient");
        }
        const responseTherapistToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkTherapistToken?token="+sessionStorage.getItem("token"));
        if(responseTherapistToken.ok){
          navigate("/therapist/patients-list");
        }
        const responseAdminToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkAdminToken?token="+sessionStorage.getItem("token"));
        if(responseAdminToken.ok){
          navigate("/admin");
        }
    }
  };

  const ProtectedPatientRoute = async () => {
    if(sessionStorage.getItem("token")){
      const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkPatientToken?token="+sessionStorage.getItem("token"));
      if(!responseToken.ok){
        navigate("/");
      }else{
        const newUserID = await responseToken.text();
        setUserID(newUserID)
        return newUserID;
      }
    }else{
      navigate("/");
    }
  }

  const ProtectedTherapistRoute = async () => {
    if(sessionStorage.getItem("token")){
      const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkTherapistToken?token="+sessionStorage.getItem("token"));
      if(!responseToken.ok){
        navigate("/");
      }else{
        const newUserID = await responseToken.text();
        setUserID(newUserID)
        return newUserID;
      }
    }else{
      navigate("/");
    }
  }

  const ProtectedAdminRoute = async () => {
      if(sessionStorage.getItem("token")){
        const responseToken = await fetch(process.env.REACT_APP_GENERAL_URL+"/token/checkAdminToken?token="+sessionStorage.getItem("token"));
        if(!responseToken.ok){
            navigate("/");
        }else{
          const newUserID = await responseToken.text();
          setUserID(newUserID)
          return newUserID;
        }
      }else{
        navigate("/");
      }
    };
  
  const handleHome = () => {
    navigate("/");
  }

  const handleCloseSession = () => {
    setMenuOpen(false);
    setUserID("");
    sessionStorage.setItem("token", "");
    navigate("/");
  }
  
  return (
    <>
    <div className="App">
       {/* Header */}
      <header className="relative z-20 flex justify-between bg-cyan-600 items-center px-8 py-6 text-white">
        <div className="flex items-center gap-8">
          <img src={require("./media/Logo.png")} onClick={handleHome} alt="RIAH" className="h-10" />
        </div>

        <nav className="flex gap-6 font-medium text-sm ">
          <a href="#home" className="hover:underline">Home</a>
          <div className="relative group">
            <button className="hover:underline">What it offers</button>
          </div>
          <a href="#plan" className="hover:underline">Project Plan</a>
          <a href="#arch" className="hover:underline">Architecture</a>
          <div className="relative group">
            <button className="hover:underline">Results</button>
          </div>
          <a href="#people" className="hover:underline">People</a>
        </nav>
      </header>
      {userID && (
        <div class="rectangle close-session-panel">
          <button class="close-session" onClick={handleCloseSession}>Cerrar sesión</button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePanel/>} />
        <Route path="/register-completed" element={<RegisterCompleted/>} />
        <Route path="/register" element={<Register redirect={()=>RedirectRoute()} setUser={(user)=>setUserID(user)}/>} />
        <Route path="/register-2fa" element={<Register2FA redirect={()=>RedirectRoute()} userID={userID}/>} />
        <Route path="/sign-in" element={<SignIn redirect={()=>RedirectRoute()} userID={userID}/>} />
        
        <Route path="/therapist/3d-model" element={ <ModelScene redirect={()=>ProtectedTherapistRoute()}/>} />
        <Route path="/therapist/patients-list" element={ <Patients_list redirect={()=>ProtectedTherapistRoute()} userID={userID}/>} />
        <Route path="/therapist/raw-data" element={ <Raw_data redirect={()=>ProtectedTherapistRoute()}/>} />
        <Route path="/therapist/evolution" element={ <Evolution redirect={()=>ProtectedTherapistRoute()}/>} />
        
        <Route path="/patient/raw-data" element={ <Raw_data redirect={()=>ProtectedPatientRoute()}/>} />
        <Route path="/patient/evolution" element={ <Evolution redirect={()=>ProtectedPatientRoute()}/>} />
        <Route path="/patient/3d-model" element={ <ModelScene redirect={()=>ProtectedPatientRoute()}/>} />
        <Route path="/patient" element={ <Patient_view redirect={()=>ProtectedPatientRoute()} userID={userID}/>} />
        
        <Route path="/admin" element={<Admin redirect={()=>ProtectedAdminRoute()} />} />
        <Route path="/versions" element={ <Versions/>} />
        
        <Route path="*" element={<HomePanel/>}/>
      </Routes>
    </div>
    <div className="rights-sub-banner">
        &copy; 2025 Grupo AIR - Todos los derechos reservados
      </div>
      </>
  );
}

export default App;
