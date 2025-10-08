import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Footer from "~/Componentes/Footer/Footer";
import Nav from "~/Componentes/Nav/Nav";

import type { Producto } from "~/Models/Producto";
import "./pagina.layout.css";
import { useTienda } from "~/hooks/useTienda";
import { useProductosWeb } from "~/hooks/useProductos";

const PaginaLayout = () => {

   const { tienda, loading, error } = useTienda();
 


  if (loading) {
    return <div className="loading">Cargando datos de la tienda... ⏳</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message} 😞</div>;
  }

 

  // Si no hay datos (y no hay error ni carga), algo salió mal, aunque el modelo Tienda | null
  // Si todo está bien, 'tienda' contendrá los datos
  if (!tienda) {
    return <div>No se encontraron datos de la tienda.</div>;
  }

   const {
    nombre,
    dominio,
    descripcion,
    configWeb, // Objeto anidado que quieres extraer
    categorias, // Array anidado que quieres extraer
    sucursales, // Array anidado que quieres extraer
    // Otros campos que podrías usar:
    // id, activa, createdAt, ...
  } = tienda; 

  
 const { banners } = configWeb;
  
  
  const handleCard = (producto: Producto) => {
    console.log(producto.nombre);
    alert(producto.nombre);
  };

  // Configuración por defecto (puede estar en un archivo aparte)
  //ConfigWeb
  

  
 
  ///

  return (
    <>
      <div className="contenidoLayout">
        <Nav
          categorias={categorias}
          configWeb={configWeb}
         
        />
        <Outlet context={{ banners, handleCard }} />
        <Footer configWeb={configWeb}></Footer>
      </div>
    </>
  );
};

export default PaginaLayout;
