import React, { useState, useEffect } from 'react';
import "./Carrito.css"
import type { ConfigWeb } from '~/Models/tiendaResponse.model';
import { useOutletContext } from 'react-router';

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
        case 'cancelado':
            return 'status-cancelado'; // Completado, no editable
            
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
            
            <p style={{textAlign:"end", fontWeight:"bold"}}>{carrito.notas?.toUpperCase()}</p>
            <p><strong>Precio Total:</strong> Bs.{carrito.precio}</p>
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
                            <span className="item-price">(Bs.{item.producto.precio.toFixed(2)} c/u)</span>
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
                        <p style={{ color: '#dc3545', margin: 0, fontWeight: 'bold' }}>No tienes productos en el carrito</p>
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

interface CarritoProps {
  
  configWeb?: ConfigWeb;

}


const CarritoCliente: React.FC = () => {

    const API_BASE_URL = "http://localhost:3000/carritos";

    const [carritos, setCarritos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Contexto para obtener el QR
    const { configWeb } = useOutletContext<CarritoProps>();
    
    const storedId = localStorage.getItem('usuarioIdWeb');
    const clienteId = storedId || "0"; 

    // --- ESTADOS PARA EL MODAL DE PAGO ---
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCart, setSelectedCart] = useState<any | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // --- FETCH CARRITOS ---
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
            if (!response.ok) throw new Error(`Error ${response.status}: No se pudo cargar el historial.`);
            const data = await response.json();
            setCarritos(data);
        } catch (err: any) {
            setError(err.message);
            setCarritos([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (clienteId !== "0") {
             fetchCarritos(clienteId);
        } else {
             setCarritos([]);
             setError(null);
        }
    }, [clienteId]); 
    
    // --- FUNCIONES DE ELIMINACIÓN ---
    const handleDeleteItem = async (carritoId, itemId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/item/${itemId}`, { method: 'DELETE' });
            if (response.status === 204) {
                fetchCarritos(clienteId); 
            } else if (response.status === 404) {
                alert(`Error: Ítem #${itemId} no encontrado.`);
            } else {
                throw new Error('Error al eliminar el ítem.');
            }
        } catch (error: any) {
            console.error("Error:", error);
            alert(`Fallo en la operación: ${error.message}`);
        }
    };
    
    const handleDeleteCarrito = async (carritoId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${carritoId}`, { method: 'DELETE' });
            if (response.status === 204) {
                fetchCarritos(clienteId);
                alert(`Carrito #${carritoId} eliminado exitosamente.`);
            } else {
                throw new Error('Error al eliminar el carrito.');
            }
        } catch (error: any) {
            console.error("Error:", error);
            alert(`Fallo en la operación: ${error.message}`);
        }
    };

    // --- LÓGICA DEL MODAL DE PAGO ---

    // 1. Abrir modal
    const handleInitiateCheckout = (carrito: any) => {
        setSelectedCart(carrito);
        setShowPaymentModal(true);
    };

    // 2. Procesar pago
    const processCheckout = async (tipoPago: 'QR' | 'SUCURSAL') => {
        if (!selectedCart) return;
        
        setIsProcessingPayment(true);
        const carritoId = selectedCart.id;
        const endpoint = tipoPago === 'QR' 
            ? `${API_BASE_URL}/${carritoId}/checkout-pagado` 
            : `${API_BASE_URL}/${carritoId}/checkout`;

        try {
            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al procesar el pedido.');
            }
            
            alert(`✅ Pedido #${carritoId} procesado exitosamente (${tipoPago === 'QR' ? 'Pagado' : 'En Sucursal'}).`);
            
            fetchCarritos(clienteId); 
            setShowPaymentModal(false);
            setSelectedCart(null);
            
        } catch (error: any) {
            console.error("Error al hacer checkout:", error);
            alert(`Fallo al procesar: ${error.message}`);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // --- RENDER ---

    if (loading) return <div className="carrito-cliente-container">Cargando carritos...</div>;
    if (error) return <div className="carrito-cliente-container" style={{ color: 'red' }}>Error: {error}</div>; 

    return (
        <>
        <div className="carrito-cliente-container">
            <h1 className="main-title">Historial de Pedidos ({carritos.length})</h1>
            
            {carritos.length === 0 && clienteId !== "0" && !loading ? (
                <p>No tienes carritos o pedidos registrados.</p>
            ) : (
                <div className="list-container">
                    {carritos.map((carrito: any) => (
                        <CarritoDetalle 
                            key={carrito.id} 
                            carrito={carrito} 
                            onDeleteItem={handleDeleteItem} 
                            onDeleteCarrito={handleDeleteCarrito} 
                            // Pasamos la nueva función que abre el modal
                            onCheckout={() => handleInitiateCheckout(carrito)} 
                        />
                    ))}
                </div>
            )}
        </div>

        {/* --- MODAL DE PAGO --- */}
        {showPaymentModal && selectedCart && (
            <div className="modal-overlay" style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
            }}>
                <div className="modal-content" style={{
                    backgroundColor: 'white', padding: '30px', borderRadius: '12px',
                    width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                    
                    <h2 style={{ marginTop: 0, color: '#333' }}>Confirmar Pedido #{selectedCart.id}</h2>
                    
                    <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Total a Pagar:</p>
                        <p style={{ margin: '5px 0', fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                            Bs. {Number(selectedCart.precio).toFixed(2)}
                        </p>
                    </div>

                    {/* CÓDIGO QR */}
                    {configWeb?.imagenQr ? (
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Escanea para pagar por QR:</p>
                            <img 
                                src={"http://localhost:3000/"+configWeb.imagenQr} // Si es URL o Base64 funciona igual
                                alt="Código QR de Pago" 
                                style={{ width: '200px', height: '200px', objectFit: 'contain', border: '1px solid #eee' }}
                            />
                            <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                                Una vez realizado el pago, presiona "Ya realicé el pago".
                            </p>
                        </div>
                    ) : (
                        <div style={{ padding: '20px', background: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '20px' }}>
                            ⚠️ No hay código QR configurado.
                        </div>
                    )}

                    {/* BOTONES */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        
                        {/* Botón 1: YA PAGUÉ (QR) */}
                        <button 
                            onClick={() => processCheckout('QR')}
                            disabled={isProcessingPayment}
                            style={{
                                padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none',
                                borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            {isProcessingPayment ? 'Procesando...' : '✅ Ya realicé el pago (QR)'}
                        </button>

                        {/* Botón 2: EN SUCURSAL */}
                        <button 
                            onClick={() => processCheckout('SUCURSAL')}
                            disabled={isProcessingPayment}
                            style={{
                                padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none',
                                borderRadius: '6px', fontSize: '16px', cursor: 'pointer'
                            }}
                        >
                            🏪 Pagaré en Sucursal
                        </button>

                        <button 
                            onClick={() => setShowPaymentModal(false)}
                            disabled={isProcessingPayment}
                            style={{
                                padding: '10px', backgroundColor: 'transparent', color: '#666', border: '1px solid #ccc',
                                borderRadius: '6px', marginTop: '10px', cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default CarritoCliente;