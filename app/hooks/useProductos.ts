// src/hooks/useProductos.ts

import { useState, useEffect } from "react";
import {type Producto } from "../Models/Producto";
import { getProductosPorFiltro, getProductosWeb } from "../services/productoService";

// Define la estructura de lo que el hook va a devolver
interface ProductosState {
  data: Producto[];
  total: number;
  loadingProducto: boolean;
  error: Error | null;
}

const initialState: ProductosState = {
  data: [],
  total: 0,
  loadingProducto: true,
  error: null,
};

/**
 * Custom Hook para obtener productos por categoría y subcategoría (opcional).
 * @param categoriaId ID de la categoría (necesario).
 * @param subcategoriaId ID de la subcategoría (opcional).
 * @returns Un objeto con los datos, total, estado de carga y error.
 */
export function useProductosPorFiltro(
  categoriaId: number | null,
  subcategoriaId: number | null = null
): ProductosState {
  const [state, setState] = useState<ProductosState>(initialState);

  useEffect(() => {
    // Si no hay ID de categoría, no hacemos la petición.
    if (!categoriaId) {
      setState(initialState);
      return;
    }
    
    const loadProductos = async () => {
      setState(prev => ({ ...prev, loadingProducto: true, error: null })); // Iniciar carga

      try {
        const response = await getProductosPorFiltro(categoriaId, subcategoriaId);
        setState({
          data: response.productos,
          total: response.total,
          loadingProducto: false,
          error: null,
        });
      } catch (err) {
        setState(prev => ({ ...prev, loadingProducto: false, error: err as Error, data: [] }));
      }
    };

    loadProductos();
    // Dependencias: el hook se re-ejecutará cada vez que cambien los IDs
  }, [categoriaId, subcategoriaId]); 

  return state;
}

// -------------------------------------------------------------
// Hook específico para la página principal (productos web)
// -------------------------------------------------------------

interface ProductosWebState {
  nuevos: Producto[];
  destacados: Producto[];
  oferta: Producto[];
  loadingProducto: boolean;
  errorProducto: Error | null;
}

const initialWebState: ProductosWebState = {
  nuevos: [],
  destacados: [],
  oferta: [],
  loadingProducto: true,
  errorProducto: null,
};

/**
 * Custom Hook para obtener los productos de la página principal (nuevos, destacados, oferta).
 * @param tiendaId El ID de la tienda.
 * @returns Un objeto con los arrays de productos, estado de carga y error.
 */
export function useProductosWeb(tiendaId: number): ProductosWebState {
  const [state, setState] = useState<ProductosWebState>(initialWebState);

  useEffect(() => {
    if (!tiendaId) return;

    const loadProductosWeb = async () => {
      setState(prev => ({ ...prev, loadingProducto: true, error: null }));

      try {
        const response = await getProductosWeb(tiendaId);
        setState({
          ...response, // Desestructura nuevos, destacados, oferta
          loadingProducto: false,
          errorProducto: null,
        });
      } catch (err) {
        setState(prev => ({ ...prev, loadingProducto: false, error: err as Error }));
      }
    };

    loadProductosWeb();
  }, [tiendaId]);

  return state;
}