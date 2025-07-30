import React, { act, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/UserPanelComponent.css';
import '../App.css';

function RegisterCompleted() {

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/sign-in')
  }

  return (
    <>
    <div className="sub-banner">
      Home
    </div>
    <main className="relative z-20 flex flex-col items-center justify-center text-center text-white px-4 py-20">
        <h1 className="text-6xl text-stone-800 font-bold tracking-wide">🎉 REGISTRO EXITOSO 🎉</h1>
        <p className="text-xl text-stone-800 mt-4">¡Ha completado su registro exitosamente! Ya puede acceder a la aplicación.</p>

        <br></br>
        <br></br>
        <button className="mt-6 px-6 py-2 bg-white text-blue-700 font-medium rounded-full shadow hover:bg-gray-100 transition" onClick={handleLogin}>
          Acceder
        </button>
      </main>
    </>
    )
 }

export default RegisterCompleted;