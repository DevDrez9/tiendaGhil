import React, { useState, useEffect, useCallback } from "react";
import type { Producto } from "~/Models/Producto";
import "./ProductoPage.css";
import { useLocation, useNavigate, useParams } from "react-router";
import { getProductoById } from "~/services/productoService";

// Tipos de Sucursal y Stock
interface Sucursal {
  id: number;
  nombre: string;
}
interface InventarioSucursal {
  id: number;
  stock: Record<string, number> | string; // Objeto o JSON string
}

const ProductoPage: React.FC = () => {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // --- Estados de Selección ---
  const [talla, setTalla] = useState("");
  const [tallasDisponibles, setTallasDisponibles] = useState<string[]>([]);
  const [cantidad, setCantidad] = useState(1);
  const [imagenSelec, setImagenSelec] = useState(0); // Estado para imagen principal

  // --- Estados de Sucursal y Stock ---
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalIdSeleccionada, setSucursalIdSeleccionada] = useState<string>("");
  const [stockPorTallaSucursal, setStockPorTallaSucursal] = useState<Record<string, number>>({});
  const [loadingStock, setLoadingStock] = useState(false);

  // EFECTO: Cargar Producto y Sucursales
  useEffect(() => {
    const productoId = id ? parseInt(id) : null;

    // Cargar Producto
    const cargarProducto = async (productoId: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductoById(productoId);
        setProducto(data);
        setTallasDisponibles(data.tallas ? data.tallas.split(",") : []);
      } catch (err) {
        setError("No se pudo cargar la información del producto.");
      } finally {
        setLoading(false);
      }
    };

    const productoFromState = (location.state as { producto: Producto | undefined } | null)?.producto;
    
    if (productoFromState) {
      setProducto(productoFromState);
      setTallasDisponibles(productoFromState.tallas ? productoFromState.tallas.split(",") : []);
      setLoading(false);
    } else if (productoId) {
      cargarProducto(productoId);
    } else {
      setLoading(false);
      setError("ID de producto no válido.");
    }

    // Cargar Sucursales
    const fetchSucursales = async () => {
      try {
        const response = await fetch("http://localhost:3000/sucursales");
        if (!response.ok) throw new Error("No se pudieron cargar las sucursales");
        const data: Sucursal[] = await response.json();
        setSucursales(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSucursales();

  }, [id, location.state]);

  // EFECTO: Cargar Stock al cambiar Sucursal
  useEffect(() => {
    if (sucursalIdSeleccionada && producto?.id) {
      const fetchStockSucursal = async () => {
        setLoadingStock(true);
        setTalla(""); // Resetear talla
        try {
          const url = `http://localhost:3000/inventario-sucursal/producto/${producto.id}/sucursal/${sucursalIdSeleccionada}`;
          const response = await fetch(url);
          
          if (!response.ok) {
            setStockPorTallaSucursal({}); // No hay stock
            return;
          }
          
          const inventario: InventarioSucursal = await response.json();
          const stockObj = typeof inventario.stock === 'string' ? JSON.parse(inventario.stock) : inventario.stock;
          setStockPorTallaSucursal(stockObj || {});

        } catch (err) {
          console.error(err);
          setStockPorTallaSucursal({});
        } finally {
          setLoadingStock(false);
        }
      };
      fetchStockSucursal();
    }
  }, [sucursalIdSeleccionada, producto?.id]);


  // --- HANDLERS (Cantidad e Imagen) ---
  const incrementar = useCallback(() => setCantidad((prev) => prev + 1), []);
  const decrementar = useCallback(() => setCantidad((prev) => (prev > 1 ? prev - 1 : 1)), []);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      if (!isNaN(value) && value >= 1) setCantidad(value);
  }, []);
  const selectImagen = useCallback((indexSelec: number) => setImagenSelec(indexSelec), []);

  const API_BASE_URL = "http://localhost:3000/carritos";
  const TIENDA_ID_ACTUAL = 1;

  // HANDLER: Añadir al Carrito (con validación de stock)
  const handleAddCarrito = async () => {
    const clienteIdString = localStorage.getItem("usuarioIdWeb");
    const clienteId = clienteIdString ? parseInt(clienteIdString) : undefined;
    
    if (!clienteId) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }
    
    if (!sucursalIdSeleccionada) {
      alert("Por favor, selecciona una sucursal.");
      return;
    }
    if (!talla) {
      alert("Por favor, selecciona una talla.");
      return;
    }
    if (loadingStock) {
      alert("Verificando stock, por favor espera...");
      return;
    }

    const stockDisponible = stockPorTallaSucursal[talla] || 0;
    if (cantidad > stockDisponible) {
      alert(`Stock insuficiente para la talla ${talla} en esta sucursal. Disponible: ${stockDisponible}, Solicitado: ${cantidad}`);
      return;
    }

    let usuario;
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${clienteId}`);
      if (!response.ok) throw new Error("Error al obtener datos del usuario");
      usuario = await response.json();
    } catch (err) {
      alert("Error al verificar usuario."); return;
    }

    const newCarritoItem = {
      productoId: producto!.id, // Usamos ! porque ya validamos al inicio
      cantidad: cantidad,
      talla: talla,
    };

    const createCarritoDto = {
      tiendaId: TIENDA_ID_ACTUAL,
      clienteId: clienteId,
      items: [newCarritoItem],
      cliente: usuario.nombre
    };

    console.log(createCarritoDto)

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createCarritoDto),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al añadir el producto al carrito.");
      }
      alert(`Producto ${producto!.nombre} (Talla ${talla}) añadido al carrito.`);
      navigate("/carrito");
    } catch (error: any) {
      console.error("Fallo la operación del carrito:", error);
      alert(`Fallo al añadir producto: ${error.message}`);
    }
  };

  // --- RENDERIZADO ---

  if (loading) return <div className="productoPage-status">Cargando producto... ⏳</div>;
  if (error || !producto) return <div className="productoPage-status error-msg">{error || "Producto no encontrado."} 😞</div>;

  return (
    <>
      <div className="productoPage">
        
        {/* ✅ CÓDIGO RESTAURADO: Sección de Imágenes */}
        <div className="imagenes">
          <div className="imagenPrincipal">
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
                key={imagen.id}
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
          <div style={{display:"flex", flexDirection:"column"}}>
            <h2 style={{textAlign:"start"}}>{producto.nombre}</h2>
            <h3>{producto.descripcion}</h3>
          </div>
          
          <div className="precioProducto">
            Bs. <b>{producto.precio}</b>
          </div>

          {/* Selector de Sucursal */}
          <div className="sucursal-selector-container" style={{ margin: "20px 0" }}>
            <label className="selector-label" style={{ fontWeight: 'bold' }}>1. Selecciona una sucursal:</label>
            <select 
              value={sucursalIdSeleccionada} 
              onChange={(e) => setSucursalIdSeleccionada(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            >
              <option value="">-- Elige una sucursal --</option>
              {sucursales.map(suc => (
                <option key={suc.id} value={suc.id}>{suc.nombre}</option>
              ))}
            </select>
          </div>

          {/* Selector de Talla (Depende de sucursal) */}
          <div className="talla-selector-container">
            <label className="selector-label">2. Selecciona una talla (Stock en Sucursal):</label>
            
            {loadingStock && <div style={{color:'blue'}}>Verificando stock...</div>}
            
            <div className="tallas-grid">
              {!sucursalIdSeleccionada ? (
                <p style={{color:'#888', fontSize:'0.9em'}}>Selecciona una sucursal para ver las tallas.</p>
              ) : (
                tallasDisponibles.map((tallaS, index) => {
                  const stockDeTalla = stockPorTallaSucursal[tallaS] || 0;
                  const isDisabled = stockDeTalla === 0;

                  return (
                    <div
                      key={index}
                      className={`talla-recuadro ${tallaS === talla ? "seleccionada" : ""} ${isDisabled ? "disabled" : ""}`}
                      onClick={() => !isDisabled && setTalla(tallaS)}
                      title={isDisabled ? "Agotado en esta sucursal" : `Disponible: ${stockDeTalla}`}
                    >
                      {tallaS}
                    </div>
                  );
                })
              )}
            </div>
            
            {talla && (
              <p className="seleccion-actual">
                Has seleccionado: <strong>{talla}</strong> (Disp: {stockPorTallaSucursal[talla] || 0})
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="comprar">
              
              {/* ✅ CÓDIGO RESTAURADO: Controles de Cantidad */}
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
                disabled={loadingStock}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductoPage;