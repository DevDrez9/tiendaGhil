// src/models/ProductoModel.ts

// Estructura para Imagen de Producto
export interface ImagenProducto {
  id: number;
  url: string;
  orden: number;
  productoId: number;
  createdAt: string;
  updatedAt: string;
}

// Estructura base para un Producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string; // O number, dependiendo de cómo lo uses
  precioOferta: string; // O number
  enOferta: boolean;
  esNuevo: boolean;
  esDestacado: boolean;
  stock: number;
  stockMinimo: number;
  sku: string;
  imagenUrl: string;
  categoriaId: number;
  subcategoriaId: number | null;
  tiendaId: number;
  proveedorId: number;
  createdAt: string;
  updatedAt: string;
  imagenes: ImagenProducto[];
}

// Estructura de la respuesta para el endpoint /productos/web
export interface ProductosWebResponse {
  nuevos: Producto[];
  destacados: Producto[];
  oferta: Producto[];
}

// Estructura de la respuesta para el endpoint /productos
export interface ProductosPorCategoriaResponse {
  productos: Producto[];
  total: number;
}