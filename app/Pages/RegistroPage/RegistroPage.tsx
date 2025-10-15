import React, { useState } from 'react';
import "./RegistroPage.css"
import InputText1 from '~/Componentes/utils/InputText';
import Boton1 from '~/Componentes/utils/Boton';
import { useNavigate } from 'react-router';

const Registro = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '', // Es opcional, pero lo incluimos
    telefono:"",
    rol:'CLIENTE'
  });
   const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | boolean | number) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar campos requeridos
    if (!form.email || !form.password || !form.nombre) {
      setError('Por favor, completa todos los campos requeridos (Email, Contraseña, Nombre).');
      return;
    }
    
    // (Opcional) Validación básica de password
    if (form.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    setLoading(true);

    try {
      // 1. Lógica de Llamada a la API (SIMULADA)
      // Reemplaza esto con tu llamada real a la API de /register
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), // Enviamos todos los datos del DTO
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al registrar el usuario. El email ya podría estar en uso.');
      }

      const data = await response.json();
       navigate("/login");
      
      

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin=()=>{
     navigate("/login");
  }

  return (
    <div className="cuerpo">
    
    <form onSubmit={handleSubmit} className='form'>
      <h2>Registro de Usuario</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      
      <InputText1 label='Email' value={form.email} onChange={(value)=>handleChange("email",value)} width={"100%"} type='email' required />
      

      <InputText1 label='Password' value={form.password} onChange={(value)=>handleChange("password",value)} width={"100%"} type='password' />
      
      
      <InputText1 label='Nombre' value={form.nombre} onChange={(value)=>handleChange("nombre",value)}width={"100%"}  required />
      <InputText1 label='Apellido' value={form.apellido} onChange={(value)=>handleChange("apellido",value)} width={"100%"}  required />
       <InputText1 label='Telefono' value={form.telefono} onChange={(value)=>handleChange("telefono",value)} width={"100%"}  required />
      

      <div style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"10px"}}>
<Boton1 type='submit' fullWidth >Registrar </Boton1>
      </div>
      
      <p>
        ¿Ya tienes cuenta? <button type="button" className='registro' onClick={handleLogin}>Inicia Sesión</button>
      </p>
    </form>
      
    </div>
  );
};


export default Registro;