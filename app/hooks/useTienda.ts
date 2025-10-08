// src/hooks/useTienda.ts

import { useState, useEffect } from "react";
import {type Tienda } from "../Models/tiendaResponse.model";
import { getTiendaData } from "../services/tiendaService";

// Define la estructura de lo que el hook va a devolver
interface TiendaState {
  tienda: Tienda | null; // Los datos de la tienda
  loading: boolean; // Estado de carga (true mientras se hace la petición)
  error: Error | null; // Cualquier error que ocurra
}

/**
 * Custom Hook para obtener y manejar los datos de la tienda.
 * @returns {TiendaState} Un objeto con los datos, el estado de carga y el error.
 */
export function useTienda(): TiendaState {
  const [tienda, setTienda] = useState<Tienda | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Función asíncrona para cargar los datos
    const loadTiendaData = async () => {
      setLoading(true); // Empezar la carga
      setError(null); // Limpiar errores anteriores

      try {
        const data = await getTiendaData(); // Llamar al servicio
        setTienda(data); // Guardar los datos en el estado
      } catch (err) {
        // En caso de error, guardar el error
        setError(err as Error);
      } finally {
        // Siempre, al finalizar, detener la carga
        setLoading(false);
      }
    };

    loadTiendaData();
  }, []); // El array vacío asegura que la función se ejecute solo una vez al montar el componente

  return { tienda, loading, error };
}