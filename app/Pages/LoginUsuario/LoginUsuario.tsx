import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import "./LoginUsuario.css"
import InputText1 from '~/Componentes/utils/InputText';
import Boton1 from '~/Componentes/utils/Boton';

const Login = ({ onLoginSuccess, onNavigateToRegister }) => {

    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña.');
      return;
    }
 

    setLoading(true);

    try {
      // 1. Lógica de Llamada a la API (SIMULADA)
      // Reemplaza esto con tu llamada real a la API de /login
      const response = await fetch('http://localhost:3000/auth/validate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Manejo de errores (ej: credenciales incorrectas)
        const data = await response.json();
        throw new Error(data.message || 'Error al iniciar sesión.');
      }

      const data = await response.json();
      
      // 2. Almacenar ID y notificar éxito (como en tu lógica anterior)
      localStorage.setItem('usuarioIdWeb', data.id); 

      
      navigate("/");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro=()=>{
     navigate("/registro");
  }

  return (
    <div className="cuerpo">

    
    <form onSubmit={handleSubmit} className='form'>
      <h2>Iniciar Sesión</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <InputText1 label='Email' value={email} onChange={(e) => setEmail(e)} width={"100%"} type='email' />
      

      <InputText1 label='Password' value={password} onChange={(e) => setPassword(e)} width={"100%"} type='password' />
      
      
      <div style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"10px"}}>
<Boton1 type='submit' fullWidth >Entrar </Boton1>
      </div>
      
      <p>
        ¿No tienes cuenta? <button className='registro' type="button" onClick={handleRegistro}>Regístrate aquí</button>
      </p>
    </form>
    </div>
  );
};

// Estilos básicos para ejemplo (puedes usar CSS real)


export default Login;