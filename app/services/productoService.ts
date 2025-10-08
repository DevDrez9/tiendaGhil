// src/services/ProductoService.ts

import {type ProductosWebResponse,type ProductosPorCategoriaResponse, type Producto } from "../Models/Producto";

const BASE_URL = "http://localhost:3000"; // ⬅️ Tu URL base

/**
 * 1. Obtiene los productos 'web' (nuevos, destacados, oferta) por tienda.
 * @param tiendaId El ID de la tienda.
 * @returns Promesa con los ProductosWebResponse.
 */
export async function getProductosWeb(tiendaId: number): Promise<ProductosWebResponse> {
  const url = `${BASE_URL}/productos/web?tiendaId=${tiendaId}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener productos web.`);
    }
    return (await response.json()) as ProductosWebResponse;
  } catch (error) {
    console.error("Fallo al obtener productos web:", error);
    throw error;
  }
}

/**
 * 2. Obtiene productos por categoría y subcategoría (opcional).
 * @param categoriaId El ID de la categoría.
 * @param subcategoriaId El ID de la subcategoría (opcional).
 * @returns Promesa con los ProductosPorCategoriaResponse.
 */
export async function getProductosPorFiltro(
  categoriaId: number,
  subcategoriaId?: number | null // subcategoriaId es opcional
): Promise<ProductosPorCategoriaResponse> {
  // Construir la URL base
  let url = `${BASE_URL}/productos?categoriaId=${categoriaId}`;
  
  // Añadir subcategoriaId si está presente y es un número
  if (subcategoriaId) {
    url += `&subcategoriaId=${subcategoriaId}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener productos por filtro.`);
    }
    return (await response.json()) as ProductosPorCategoriaResponse;
  } catch (error) {
    console.error("Fallo al obtener productos por filtro:", error);
    throw error;
  }
}
export async function getProductoById(productoId: number): Promise<Producto> {
  const url = `${BASE_URL}/productos/${productoId}`; // Asumiendo un endpoint RESTful

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener el producto ${productoId}.`);
    }
    return (await response.json()) as Producto;
  } catch (error) {
    console.error(`Fallo al obtener producto ${productoId}:`, error);
    throw error;
  }
}