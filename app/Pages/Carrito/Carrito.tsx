import React, { useState, useEffect } from 'react';
import "./Carrito.css"

// ⚠️ URL Base de tu API y URL Base de IMÁGENES
const API_BASE_URL = 'http://localhost:3000/carritos'; 
// 🚨 CAMBIA esta URL por la base donde se encuentran las imágenes
const IMAGES_BASE_URL = 'http://localhost:3000/uploads/productos/'; 

// Función auxiliar para determinar la clase de estado
const getStatusClass = (estado) => {
    switch (estado) {
        case 'nuevo':
            return 'status-nuevo'; // Editable
        case 'pendiente':
            return 'status-pendiente'; // En proceso, no editable
        case 'finalizado':
            return 'status-finalizado'; // Completado, no editable
        default:
            return 'status-otro';
    }
};

// ----------------------------------------------------
// Componente para la visualización detallada de un Carrito
// ----------------------------------------------------
const CarritoDetalle = ({ carrito, onDeleteItem, onDeleteCarrito, onCheckout }) => {
    const isEditable = carrito.estado === 'nuevo'; 
    const isCheckoutable = carrito.estado === 'nuevo' && carrito.items.length > 0;

    const handleDeleteItemClick = (itemId) => {
        if (isEditable) {
            onDeleteItem(carrito.id, itemId); 
        }
    };
    
    const handleDeleteCarritoClick = () => {
        if (isEditable) {
            if (window.confirm(`¿Estás seguro de que quieres eliminar completamente el Carrito #${carrito.id}?`)) {
                onDeleteCarrito(carrito.id);
            }
        }
    };

    const handleCheckoutClick = () => {
        if (isCheckoutable) {
            if (window.confirm(`¿Deseas confirmar el Pedido #${carrito.id}? Se convertirá en Pendiente.`)) {
                onCheckout(carrito.id);
            }
        }
    };


    return (
        
        <div className="carrito-card">
            <div className="carrito-header">
                <h3 className="carrito-title">Pedido </h3>
                <span className={`carrito-status ${getStatusClass(carrito.estado)}`}>
                    {carrito.estado.toUpperCase()}
                </span>
            </div>
            
            <p><strong>Precio Total:</strong> ${carrito.precio}</p>
            <p><strong>Fecha:</strong> {new Date(carrito.createdAt).toLocaleDateString()}</p>
            
            <h4 className="carrito-subtitle">Ítems ({carrito.items.length})</h4>
            <ul className="item-list">
                {carrito.items.map((item) => (
                    <li key={item.id} className="item-list-item">

                       
                        
                        {/* MOSTRAR IMAGEN DEL PRODUCTO */}
                         {item.producto.imagenPrincipalUrl && (
                            <div className="item-image-container">
                                
                                <img 
                                    src={`${IMAGES_BASE_URL}${item.producto.imagenPrincipalUrl}`} 
                                    alt={item.productoNombre} 
                                    className="item-image"
                                    
                                    // 🎯 CORRECCIÓN APLICADA: Forzar el tipo de 'e'
                                    onError={(e) => { 
                                        // e.currentTarget es más específico que e.target en React
                                        e.currentTarget.onerror = null; // Previene bucle infinito
                                        e.currentTarget.src = '/placeholder.jpg'; // Imagen de reserva
                                    }} 
                                />
                            </div>
                        )}
                        
                        {/* Contenido del item */}
                        <div className="item-details">
                            <span>{item.cantidad} x {item.producto.nombre}</span>
                            <span className="item-price">(${item.producto.precio.toFixed(2)} c/u)</span>
                        </div>
                        
                        {/* Botón de eliminación del ÍTEM */}
                        {isEditable && (
                            <button 
                                onClick={() => handleDeleteItemClick(item.id)} 
                                className="delete-button"
                                title="Eliminar ítem del carrito"
                            >
                                🗑️
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            
            {/* Contenedor de acciones: Checkout y Eliminar Carrito */}
            {isEditable && (
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    {isCheckoutable ? (
                        <button 
                            onClick={handleCheckoutClick}
                            className="checkout-button"
                        >
                            Hacer Pedido (Checkout)
                        </button>
                    ) : (
                        <p style={{ color: '#dc3545', margin: 0, fontWeight: 'bold' }}>Carrito vacío</p>
                    )}

                    <button 
                        onClick={handleDeleteCarritoClick}
                        className="delete-carrito-button"
                    >
                        Eliminar Carrito
                    </button>
                </div>
            )}

            {carrito.estado === 'finalizado' && <p className="completed-message">¡Pedido entregado y finalizado!</p>}
        </div>
    );
};

// ----------------------------------------------------
// Componente principal CarritoCliente (Lógica de API)
// ----------------------------------------------------
const CarritoCliente = () => {
    const [carritos, setCarritos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const storedId = localStorage.getItem('usuarioIdWeb');
    const clienteId = storedId || "0"; 

    // Función que recarga los carritos
    const fetchCarritos = async (id) => {
        if (id === "0") {
            setError("Usuario no autenticado.");
            setCarritos([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/${id}/cliente`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo cargar el historial de carritos.`);
            }
            const data = await response.json();
            setCarritos(data);
        } catch (err) {
            setError(err.message);
            setCarritos([]);
        } finally {
            setLoading(false);
        }
    };
    
    // Hook para la carga inicial
    useEffect(() => {
        if (clienteId !== "0") {
             fetchCarritos(clienteId);
        } else {
             setCarritos([]);
             setError(null);
        }
    }, [clienteId]); 
    
    // FUNCIÓN REAL: Eliminar un ÍTEM específico
    const handleDeleteItem = async (carritoId, itemId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/item/${itemId}`, {
                method: 'DELETE',
            });
            
            if (response.status === 204) {
                // Éxito: Recargar datos para actualizar precios y visual
                fetchCarritos(clienteId); 
            } else if (response.status === 404) {
                alert(`Error: Ítem #${itemId} no encontrado.`);
            } else {
                throw new Error('Error al eliminar el ítem.');
            }
        } catch (error) {
            console.error("Error al eliminar el ítem:", error);
            alert(`Fallo en la operación: ${error.message}`);
        }
    };
    
    // FUNCIÓN REAL: Eliminar el CARRITO COMPLETO
    const handleDeleteCarrito = async (carritoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${carritoId}`, {
                method: 'DELETE',
            });
            
            if (response.status === 204) {
                // Éxito: Recargar datos
                fetchCarritos(clienteId);
                alert(`Carrito #${carritoId} eliminado exitosamente.`);
            } else if (response.status === 404) {
                alert(`Error: Carrito #${carritoId} no encontrado.`);
            } else {
                throw new Error('Error al eliminar el carrito.');
            }
        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            alert(`Fallo en la operación: ${error.message}`);
        }
    };

    // FUNCIÓN NUEVA: HACER CHECKOUT (Finalizar Pedido)
    const handleCheckout = async (carritoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${carritoId}/checkout`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al procesar el pedido.');
            }
            
            // Éxito: El carrito ahora está en estado 'pendiente'. Recargamos los datos.
            fetchCarritos(clienteId);
            alert(`Pedido #${carritoId} realizado exitosamente. Estado: Pendiente.`);
            
        } catch (error) {
            console.error("Error al hacer checkout:", error);
            alert(`Fallo al hacer el pedido: ${error.message}`);
        }
    };


    if (loading) return <div className="carrito-cliente-container">Cargando carritos...</div>;
    if (error) return <div className="carrito-cliente-container" style={{ color: 'red' }}>Error: {error}</div>; 

    return (
        <div className="carrito-cliente-container">
            <h1 className="main-title">Historial de Pedidos ({carritos.length})</h1>
            
            {carritos.length === 0 && clienteId !== "0" && !loading ? (
                <p>No tienes carritos o pedidos registrados.</p>
            ) : (
                <div className="list-container">
                    {carritos.map((carrito) => (
                        <CarritoDetalle 
                            key={carrito.id} 
                            carrito={carrito} 
                            onDeleteItem={handleDeleteItem} 
                            onDeleteCarrito={handleDeleteCarrito} 
                            onCheckout={handleCheckout} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarritoCliente;