// src/services/TiendaService.ts

import {type Tienda } from "../Models/tiendaResponse.model"; // Importamos el modelo

const API_URL = "http://localhost:3000/tiendas/1"; // ⬅️ Reemplaza con tu URL real

/**
 * Obtiene los datos completos de la tienda desde la API.
 * @returns {Promise<Tienda>} Una promesa que resuelve con el objeto Tienda.
 * @throws {Error} Si la respuesta de la red no es satisfactoria.
 */
export async function getTiendaData(): Promise<Tienda> {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      // Lanzar un error si el estado HTTP no es 2xx
      throw new Error(
        `Error al obtener datos de la tienda: ${response.status} ${response.statusText}`
      );
    }

    const data: Tienda = await response.json();
    return data;
  } catch (error) {
    console.error("Fallo al ejecutar la petición API:", error);
    // Vuelve a lanzar el error para que el hook pueda manejarlo
    throw error;
  }
}