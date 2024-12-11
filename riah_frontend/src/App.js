import './App.css';
import Raw_data from "./components/Raw_data_component"

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
      <Raw_data></Raw_data>
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
