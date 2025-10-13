import React, { useState, useEffect } from 'react';

import "./ClientePage.css"
import { useNavigate, useOutletContext } from 'react-router';

// 🚨 URL del endpoint de tu API para obtener datos del usuario
const USER_API_URL = 'http://localhost:3000/usuarios'; 

const PerfilCliente = () => {
    // 1. Obtener la función de cambio de autenticación del Layout
   
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener el ID del cliente de forma incondicional desde localStorage
    const storedId = localStorage.getItem('usuarioIdWeb');
    const clienteId = storedId || "0"; 

    // ----------------------------------------------------
    // FUNCIÓN PARA CARGAR LOS DATOS DEL USUARIO
    // ----------------------------------------------------
    const fetchUserData = async (id) => {
        if (id === "0") {
            setError("No hay una sesión activa.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Endpoint para obtener datos del usuario por ID: GET /api/usuarios/:id
            const response = await fetch(`${USER_API_URL}/${id}`);
            
            if (!response.ok) {
                // Manejo de errores 404, 500, etc.
                throw new Error(`Error ${response.status}: No se pudo cargar el perfil.`);
            }

            const data = await response.json();
            setUserData(data);
            
        } catch (err) {
            console.error("Error al cargar el perfil:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // ----------------------------------------------------
    // FUNCIÓN PARA CERRAR SESIÓN
    // ----------------------------------------------------
    const handleLogout = () => {
        // Llama a la función del Layout para limpiar el estado y localStorage
        localStorage.removeItem('usuarioIdWeb');
        
        // Opcional: Redirigir a la página de inicio o login
        navigate('/'); 
        alert('Sesión cerrada exitosamente.');
    };

    // Hook de efecto para cargar datos al montar o si el clienteId cambia
    useEffect(() => {
        fetchUserData(clienteId);
    }, [clienteId]); 

    // ----------------------------------------------------
    // RENDERIZADO
    // ----------------------------------------------------
    if (loading) return <div className="perfil-container">Cargando datos...</div>;
    
    if (error || !userData) {
        return (
            <div className="perfil-container">
                <h2 className="perfil-title">Mi Perfil</h2>
                <p className="error-message">Error: {error || "Datos de usuario no disponibles."}</p>
                {/* Mostrar botón de cerrar sesión si el error no es por ID=0, por si acaso */}
                {clienteId !== "0" && (
                    <button onClick={handleLogout} className="logout-button">
                        Cerrar Sesión
                    </button>
                )}
            </div>
        );
    }
    
    return (
        <div className="perfil-container">
            <h2 className="perfil-title">Mi Perfil de Cliente</h2>
            
            <div className="user-details-card">
                <div className="detail-group">
                    <span className="detail-label">Nombre Completo:</span>
                    <span className="detail-value">{userData.nombre} {userData.apellido || ''}</span>
                </div>
                
                <div className="detail-group">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{userData.email}</span>
                </div>
                
                <div className="detail-group">
                    <span className="detail-label">ID de Usuario:</span>
                    <span className="detail-value">{userData.id}</span>
                </div>
                
                {/* Añade más campos según la estructura de userData (teléfono, dirección, etc.) */}
                {userData.telefono && (
                    <div className="detail-group">
                        <span className="detail-label">Teléfono:</span>
                        <span className="detail-value">{userData.telefono}</span>
                    </div>
                )}
            </div>

            <button onClick={handleLogout} className="logout-button">
                Cerrar Sesión
            </button>
        </div>
    );
};

export default PerfilCliente;