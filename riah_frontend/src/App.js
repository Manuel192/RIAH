import './App.css';
import Register from './components/Register_component';
import SignIn from './components/Sign_in_component';
import User_panel from './components/User_panel_component';
import Create_session from './components/Create_session_component';
import Evolution from './components/Evolution_component';
import Patients_list from './components/Patients_list_component';
import Raw_data from "./components/Raw_data_component"
import ModelScene from './components/3DModelScene';
import PointsScene from './components/3DPointsScene';
import Create_Patient from './components/Create_patient_component';
import { useLocation, useNavigate } from 'react-router-dom';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Admin from './components/Admin_component';

function App() {
  const navigate=useNavigate();

  const handlePanel = () => {
    navigate('/');
  }
  
  return (
    <div className="App">
       <header className="header">
        <div className="left-section">
          <img src={require('./media/RIAH_default_icon.png')} width={60} alt="Logo" className="logo" />
          <h1 className="title">&nbsp;RIAH</h1>
        </div>
        <div className="right-section">
          <button className="nav-button">Rehab-Immersive</button>
          <button className="nav-button">Sobre Nosotros</button>
          <button className="nav-button" onClick={handlePanel}>Mi panel</button>
          <img src={require('./media/RIAH_profile.png')} alt="Profile" className="profile-pic" />
        </div>
      </header>
      <Routes>
        <Route path="/user" element={<User_panel />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/user/sign-in" element={<Register />} />
        <Route path="/user/3d-model" element={<ModelScene />} />
        <Route path="/user/3d-points" element={<PointsScene />} />
        <Route path="/user/patients-list" element={<Patients_list />} />
        <Route path="/user/raw-data" element={<Raw_data />} />
        <Route path="/user/evolution" element={<Evolution />} />
        <Route path="/user/create-session" element={<Create_session />} />
        <Route path={process.env.REACT_APP_ADMIN_URL} element={<Admin />} />
        <Route path="*" element={<User_panel/>}/>
      </Routes>
      <div className="rights-sub-banner">
        &copy; 2024 Grupo AIR - Todos los derechos reservados
      </div>
    </div>

  );
}

export default App;
