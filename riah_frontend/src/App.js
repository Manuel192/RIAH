import './App.css';
import Create_session from './components/Create_session_component';
import Evolution from './components/Evolution_component';
import Patients_list from './components/Patients_list_component';
import Raw_data from "./components/Raw_data_component"
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  
  return (
    <div className="App">
       <header className="header">
        <div className="left-section">
          <img src={require('./media/RIAH_default_icon.png')} width={60} alt="Logo" className="logo" />
          <h1 className="title">&nbsp;RIAH</h1>
        </div>
        <div className="right-section">
          <button className="nav-button">Home</button>
          <button className="nav-button">Sobre RIAH</button>
          <button className="nav-button">Mi portal</button>
          <img src={require('./media/RIAH_profile.png')} alt="Profile" className="profile-pic" />
        </div>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<Patients_list />} />
          <Route path="/raw-data" element={<Raw_data />} />
          <Route path="/evolution" element={<Evolution />} />
          <Route path="/create-session" element={<Create_session />} />
        </Routes>
      </Router>
      <footer className="footer">
        <div className="footer-nav">
          <button className="footer-button">Sobre nosotros</button>
          <button className="footer-button">Política de privacidad</button>
          <button className="footer-button">Contáctanos</button>
        </div>
      </footer>
      <div className="rights-sub-banner">
        &copy; 2024 Grupo AIR - Todos los derechos reservados
      </div>
    </div>

  );
}

export default App;
