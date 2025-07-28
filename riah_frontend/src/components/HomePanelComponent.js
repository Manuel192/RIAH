import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/UserPanelComponent.css';
import '../App.css';
import { Center } from '@react-three/drei';

function HomePanel() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
      const init = async () => {
        setIsModalOpen(!sessionStorage.getItem("policy-read") ?? true);
    }
    init()
  }, []);
  
  const handleCloseModal = () => {
      sessionStorage.setItem("policy-read", true);
      setIsModalOpen(false);
    };
  
    const handleConfirm = () => {
      // Acción de confirmaciónsession
      alert("Confirmado");
      setIsModalOpen(false);
    };

    function Modal({ onClose, onConfirm }) {
    return (
      <div className="modal-overlay">
        <div className="modal" style={{width:"80%", height:"80%", overflowY:"auto",verticalAlign:"top"}}>
          <h3 style={{fontSize:"40px", fontWeight:"bold"}}>Política de privacidad y uso</h3>
          <div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Fecha de &uacute;ltima actualizaci&oacute;n:&nbsp;08/07/2025</div>

          <div style={{textAlign:"left"}}>
            	Esta aplicaci&oacute;n web recopila y procesa informaci&oacute;n exclusivamente con fines de an&aacute;lisis funcionales relacionados con el uso de la plataforma.
            <br />
            <br />
            <label style={{fontWeight:"bold"}}>&iquest;Qu&eacute; datos recopilamos?</label>
            <br />
            <br />
            - Archivos que el usuario decide importar manualmente: datos an&oacute;nimos de tracking y archivos multimedia de sesiones de terapia mediante realidad virtual.
            <br />
            - Datos personales que el usuario ofrece para acceder al sistema. El sistema &uacute;nicamente necesita el correo electr&oacute;nico del usuario por cuestiones de seguridad.
            <br />
            - Cookies de sesi&oacute;n para mantener la autenticaci&oacute;n del usuario durante su navegaci&oacute;n.
            <br />
            <br />
            <label style={{fontWeight:"bold"}}>&iquest;Qu&eacute; tipo de cookies utilizamos?</label>
            <br />
            <br />
            Utilizamos cookies de sesi&oacute;n. Se eliminan autom&aacute;ticamente cuando pasa un per&iacute;odo breve de tiempo sin que el usuario haya iteractuado con el sistema. Al utilizar esta web, se asume el uso de esta cookie esencial sin necesidad de consentimiento expl&iacute;cito, en cumplimiento con la legislaci&oacute;n vigente.
            <br />
            <br />
            <label style={{fontWeight:"bold"}}>&iquest;Qu&eacute; informaci&oacute;n obtenemos del usuario?</label>
            <br />
            <br />
            La aplicaci&oacute;n no rastrea ni almacena informaci&oacute;n personal. No utilizamos cookies de terceros, de publicidad ni de an&aacute;lisis.
            <br />
            <br />
            <label style={{fontWeight:"bold"}}>&iquest;C&oacute;mo se utilizan los datos almacenados?</label>
            <br />
            <br />
            Los datos almacenados siguen procedimientos de anonimizaci&oacute;n que eliminan cualquier relaci&oacute;n con su autor. Como medida adicional, los datos de mayor sensibilidad siguen un protocolo de cifrado fuerte y seguro para evitar la lectura directa de cualquier usuario externo. Los datos proporcionados son utilizados para:
            <br />
            <br />
            - Mostrar a sus autores representaciones gr&aacute;ficas de sus datos y evoluci&oacute;n.
            <br />
            - Proporcionar a los terapeutas la posibilidad de gestionar la evoluci&oacute;n de sus pacientes.
            <br />
            <br />
            <label style={{fontWeight:"bold"}}>&iquest;Compartimos estos datos con terceros?</label>
            <br />
            No. Los datos nunca se comparten con terceros ni se utilizan con fines publicitarios.
          
          <div>
            &nbsp;
          </div>
          <div>
            <label style={{fontWeight:"bold"}}> &iquest;D&oacute;nde se almacenan?</label>
          </div>
          <div>
            Todos los datos se almacenan en servidores seguros gestionados por la UCLM.
            <br />
            <br />
            <label style={{fontWeight:"bold"}}>Derechos del usuario</label>
            <br />
            <br />
            Aunque no se recopilan datos identificables, los usuarios pueden solicitar la eliminaci&oacute;n de los datos de su sesi&oacute;n en cualquier momento escribiendo a rehabimmersiveanalysishub@gmail.com.
            <br />
            <br />
            <label style={{fontWeight:"bold"}}>Responsabilidad del usuario</label>
            <br />
            <br />
            El usuario que firme este acuerdo se responsabiliza de las siguientes acciones:
            <br />
            <br />
            - No difundir informaci&oacute;n del sistema fuera de los l&iacute;mites del sector sanitario.
            <br />
            - Emplear identificadores an&oacute;nimos, evitando la asignaci&oacute;n directa de informaci&oacute;n a los autores.
            <br />
            - Cumplir con los derechos del usuario respecto al consentimiento para llevar a cabo el tratamiento de sus datos.
            <br />
            <br />
           <label style={{fontWeight:"bold"}}>Contacto</label>
            <br />
            Para m&aacute;s informaci&oacute;n, puede contactar a: rehabimmersiveanalysishub@gmail.com
          </div>
        </div>
        <button className="button-patients-list" onClick={handleCloseModal}>Estoy de acuerdo</button>
        </div>
        </div>
    );
  }
  // Estado para la búsqueda y la selección
  const navigate = useNavigate();
  const [texto,setTexto]=useState("¡Bienvenid@ a una versión temprana de RIAH. Esta plataforma le permitirá administrar la información de sus pacientes adquirida mediante la plataforma Rehab-Immersive. Acceda a su lista de pacientes para comenzar su sesión o acceda al panel de administración.");

  const handleRegister = () => {
    navigate('/register')
  }

  const handleLogin = () => {
    navigate('/sign-in')
  }

  const handleGroupAIR = () => {
    window.open('https://air.esi.uclm.es/air/')
  }

  return (
    <>
    {isModalOpen && (<Modal onClose={handleCloseModal} onConfirm={handleConfirm} />)}
    <div className="sub-banner">
      Home
    </div>
    <main className="relative z-20 flex flex-col items-center justify-center text-center text-white px-4 py-20">
        <h1 className="text-8xl text-stone-800 font-bold tracking-wide">Rehab-Immersive</h1>
        <p className="text-xl text-stone-800 mt-4">¡Empieza a gestionar tus sesiones de rehabilitación!</p>

        <br></br>
        <br></br>
        <button className="text-2xl font-semibold mt-2 text-blue-300 hover:underline" onClick={handleLogin}>¡Accede a la aplicación!</button>
        <button className="mt-6 px-6 py-2 bg-white text-blue-700 font-medium rounded-full shadow hover:bg-gray-100 transition" onClick={handleGroupAIR}>
          Un trabajo de investigación del Grupo AIR
        </button>
      </main>
    </>
    )
 }

export default HomePanel;