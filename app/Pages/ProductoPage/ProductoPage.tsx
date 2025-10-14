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
  const [talla, setTalla] = useState("");
  const [tallas, setTallas] = useState([]);

  // 3. EFECTO PARA LA CARGA DE DATOS (Estado de Navegación vs. Fetch)
  useEffect(() => {
    // Intentar extraer el producto del estado de navegación
    const productoFromState = (
      location.state as { producto: Producto | undefined } | null
    )?.producto;
    const productoId = id ? parseInt(id) : null;

    // Caso 1: Producto disponible en el estado de navegación
    if (productoFromState) {
      console.log("Producto cargado desde el estado de navegación.");
      setProducto(productoFromState);
      setTallas(productoFromState.sku.split(","));
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
        .then((data) => {
          setProducto(data);
          setLoading(false);
          setTallas(data.sku.split(","));
        })
        .catch((err) => {
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
  const API_BASE_URL = "http://localhost:3000/carritos";
  const TIENDA_ID_ACTUAL = 1; // Reemplaza con el ID de tu tienda

  const handleAddCarrito = async () => {
    // 1. Obtener el clienteId desde localStorage
    const clienteIdString = localStorage.getItem("usuarioIdWeb");
    const clienteId = clienteIdString ? parseInt(clienteIdString) : undefined;

    let usuario;

    
    try {
      // Endpoint para obtener datos del usuario por ID: GET /api/usuarios/:id
      const response = await fetch(
        `http://localhost:3000/usuarios/${clienteId}`
      );

      if (!response.ok) {
        // Manejo de errores 404, 500, etc.
        throw new Error(
          `Error ${response.status}: No se pudo cargar el perfil.`
        );
      }

      const data = await response.json();
      usuario=data
      
    } catch (err) {
      console.error("Error al cargar el perfil:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

    // Si el clienteId no existe, no puede crear/actualizar el carrito
    if (!clienteId) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    // Validar datos mínimos
    if (!producto || !producto.id || cantidad < 1) {
      alert("Error: Producto ID o Cantidad inválidos.");
      return;
    }

    // 2. Construir el DTO (Data Transfer Object)
    const newCarritoItem = {
      productoId: producto.id,
      cantidad: cantidad,
      talla: talla,
    };
   

    const createCarritoDto = {
      tiendaId: TIENDA_ID_ACTUAL,
      clienteId: clienteId,
      items: [newCarritoItem],
      cliente: usuario.nombre

      // Los campos opcionales como 'cliente', 'telefono', etc., se omiten aquí
      // a menos que los necesites enviar en la primera adición.
    };

    console.log("Enviando al carrito:", createCarritoDto);

    try {
      // 3. Enviar la solicitud POST a la API
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Si usas autenticación JWT, aquí incluirías el token
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(createCarritoDto),
      });

      // 4. Manejar la respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al añadir el producto al carrito."
        );
      }

      const carritoResponse = await response.json();

      // El carritoResponse tendrá el carrito completo (existente o recién creado)
      console.log("Producto añadido. Carrito actual:", carritoResponse);
      alert(`Producto ${producto.nombre} añadido (Cantidad: ${cantidad}).`);
      navigate("/carrito")

      // Opcional: Actualizar el estado global del carrito si estás usando Context
      // updateGlobalCart(carritoResponse);
    } catch (error) {
      console.error("Fallo la operación del carrito:", error);
      alert(`Fallo al añadir producto: ${error.message}`);
    }
  };

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
    return (
      <div className="productoPage-status error-msg">
        {error || "Producto no encontrado."} 😞
      </div>
    );
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
                src={
                  "http://localhost:3000/uploads/productos/" +
                  producto.imagenes[imagenSelec].url
                }
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
          <div className="talla-selector-container">
            <label className="selector-label">Selecciona una talla:</label>
            <div className="tallas-grid">
              {/* 2. Mapeo de las tallas para crear los recuadros */}
              {tallas.map((tallaS, index) => (
                <div
                  key={index}
                  className={`talla-recuadro ${
                    tallaS === talla ? "seleccionada" : ""
                  }`}
                  onClick={() => setTalla(tallaS)}
                  // Opcional: Deshabilitar visualmente una talla (ej. si no hay stock)
                  // className={`talla-recuadro ${talla === 'XXL' ? 'disabled' : ''} ... `}
                >
                  {tallaS}
                </div>
              ))}
            </div>

            {/* Opcional: Mostrar la selección actual */}
            {talla && (
              <p className="seleccion-actual">
                Has seleccionado: <strong>{talla}</strong>
              </p>
            )}
          </div>

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
                onClick={handleAddCarrito}
              />
            </div>
          </div>
          {/*<div className="hacerPedido">Realizar Pedido</div>*/}
        </div>
      </div>
    </>
  );
};

export default ProductoPage;
