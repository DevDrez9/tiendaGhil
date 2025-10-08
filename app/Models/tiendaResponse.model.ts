// src/models/TiendaModel.ts

// Estructura para Banner
export interface Banner {
  id: number;
  url: string;
  orden: number;
  titulo: string;
  subtitulo: string;
  enlace: string | null;
  configWebId: number;
  createdAt: string;
  updatedAt: string;
}

// Estructura para ConfigWeb
export interface ConfigWeb {
  id: number;
  nombreSitio: string;
  logoUrl: string | null;
  colorPrimario: string;
  colorSecundario: string;
  createdAt: string;
  updatedAt: string;
  banners: Banner[];
}

// Estructura para Subcategoria
export interface Subcategoria {
  id: number;
  nombre: string;
  descripcion: string;
  categoriaId: number;
  createdAt: string;
  updatedAt: string;
}

// Estructura para Categoria
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  tiendaId: number;
  createdAt: string;
  updatedAt: string;
  subcategorias: Subcategoria[];
}

// Estructura para Sucursal
export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  responsable: string;
  activa: boolean;
  tiendaId: number;
  createdAt: string;
  updatedAt: string;
}

// Estructura principal de la Tienda
export interface Tienda {
  id: number;
  nombre: string;
  descripcion: string;
  dominio: string;
  activa: boolean;
  configWebId: number;
  createdAt: string;
  updatedAt: string;
  esPrincipal: boolean;
  configWeb: ConfigWeb;
  categorias: Categoria[];
  sucursales: Sucursal[];
}

// Un modelo "limpio" o transformado (opcional, para usar en la UI)
// Por ejemplo, solo con los campos que realmente necesitas
// export type TiendaSimple = Pick<Tienda, 'nombre' | 'dominio' | 'activa'>;