import React, { useState, useEffect, useCallback } from "react";

import type { Producto } from "~/Models/Producto"; // Asegúrate de que esta ruta sea correcta


import "./ProductoPage.css";
import { useLocation, useNavigate, useParams } from "react-router";
import { getProductoById } from "~/services/productoService";

// ⭐️ ELIMINAR PROPS: El componente ya no recibe 'producto' como prop
// const ProductoPage: React.FC<ProductoPageProps> = ({ producto }) => {
const ProductoPage: React.FC = () => {
  // 1. GESTIÓN DEL ESTADO INTERNO DEL PRODUCTO
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 2. HOOKS DE NAVEGACIÓN
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL: /producto/5 -> id: '5'
  const location = useLocation(); // Obtiene el estado pasado: { state: { producto: Producto } }
  const navigate = useNavigate();

  // 3. EFECTO PARA LA CARGA DE DATOS (Estado de Navegación vs. Fetch)
  useEffect(() => {
    // Intentar extraer el producto del estado de navegación
    const productoFromState = (location.state as { producto: Producto | undefined } | null)?.producto;
    const productoId = id ? parseInt(id) : null;

    // Caso 1: Producto disponible en el estado de navegación
    if (productoFromState) {
      console.log("Producto cargado desde el estado de navegación.");
      setProducto(productoFromState);
      setLoading(false);
      setError(null);
      return;
    }

    // Caso 2: El usuario navegó directamente o hizo refresh (Necesita Fetch)
    if (productoId) {
      console.log(`Buscando producto con ID ${productoId} vía API...`);
      setLoading(true);
      setError(null);

      getProductoById(productoId) // Llama a la nueva función del servicio
        .then(data => {
          setProducto(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error al obtener producto por ID:", err);
          setError("No se pudo cargar la información del producto.");
          setLoading(false);
        });
    } else {
      // Caso 3: No hay ID en la URL (Error de ruta)
      setLoading(false);
      setError("ID de producto no válido en la URL.");
      // Opcional: Redirigir si la URL es inválida
      // navigate('/', { replace: true }); 
    }
  }, [id, location.state]); // Re-ejecutar si el ID o el estado de la ruta cambian

  // -----------------------------------------------------------
  // Lógica de Cantidad (Se mantiene igual, ahora usa el estado 'cantidad')
  // -----------------------------------------------------------
  const [cantidad, setCantidad] = useState(1); // Valor inicial 1

  const incrementar = useCallback(() => {
    setCantidad((prev) => prev + 1);
  }, []);

  const decrementar = useCallback(() => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1)); // No permite menos de 1
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setCantidad(value);
    }
  }, []);
  
  // -----------------------------------------------------------
  // Lógica de Selección de Imagen (Se mantiene igual)
  // -----------------------------------------------------------
  const [imagenSelec, setImagenSelec] = useState(0);
  const selectImagen = useCallback((indexSelec: number) => {
    setImagenSelec(indexSelec);
  }, []);
  
  // -----------------------------------------------------------
  // Manejo de Estados de Carga y Error
  // -----------------------------------------------------------
  if (loading) {
    return <div className="productoPage-status">Cargando producto... ⏳</div>;
  }

  if (error || !producto) {
    // Si hay error o no hay producto después de intentar cargar
    return <div className="productoPage-status error-msg">{error || "Producto no encontrado."} 😞</div>;
  }

  // -----------------------------------------------------------
  // Renderizado (Ahora usa la variable 'producto' del estado local)
  // -----------------------------------------------------------

  return (
    <>
      <div className="productoPage">
        <div className="imagenes">
          <div className="imagenPrincipal">
            {/* Validar que el array de imágenes tenga al menos un elemento */}
            {producto.imagenes.length > 0 && (
              <img 
                src={"http://localhost:3000/uploads/productos/" + producto.imagenes[imagenSelec].url} 
                alt={producto.nombre} 
              />
            )}
          </div>
          <div className="imagenesSegundarias">
            {producto.imagenes.map((imagen, index) => (
              <div
                key={imagen.id} // Usar una clave única para los elementos del array
                className={`imagenSegundaria ${
                  index === imagenSelec ? "imagenSelec" : ""
                }`}
                onClick={() => selectImagen(index)}
              >
                <img 
                  src={"http://localhost:3000/uploads/productos/" + imagen.url} 
                  alt={`${producto.nombre} miniatura ${index + 1}`} 
                />
              </div>
            ))}
          </div>
        </div>
        <div className="contenidoProducto">
          <h2>{producto.nombre}</h2>
          <div className="precioProducto">
            Bs. <b>{producto.precio}</b>
          </div>

          {/* ... (El resto del contenido como colores, tallas, etc., se mantiene igual) ... */}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="comprar">
              <div className="cantidadCompra">
                <div className="controlesCantidad">
                  <input
                    type="button"
                    className="masCantidad"
                    onClick={incrementar}
                    value="+"
                  />

                  <input
                    className="menosCantidad"
                    onClick={decrementar}
                    value="-"
                  />
                </div>
                <div className="cantidadSelect">
                  <input
                    type="number"
                    name="cantidad"
                    min="1"
                    value={cantidad}
                    onChange={handleChange}
                    id="cantidad"
                  />
                </div>
              </div>

              <input
                className="botonComprar"
                type="button"
                value="Agregar Carrito"
              />
            </div>
          </div>
          <div className="hacerPedido">Realizar Pedido</div>
        </div>
      </div>
    </>
  );
};

export default ProductoPage;