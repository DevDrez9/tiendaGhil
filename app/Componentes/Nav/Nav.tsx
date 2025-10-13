import React, { useEffect, useState } from "react";

import "./Nav.css";

import { useNavigate } from "react-router";
import type { Categoria, ConfigWeb } from "~/Models/tiendaResponse.model";
import UserIcon from "~/svgs/userSvg";
import CartIcon from "~/svgs/carritoSvg";

interface NavProps {
  categorias: Categoria[];
  configWeb:ConfigWeb;
  usuarioIdWeb:string;
  
  
}

const Nav: React.FC<NavProps> = ({ categorias, configWeb, usuarioIdWeb  }) => {
  const [isAtTop, setIsAtTop] = useState(true);



  useEffect(() => {

   

    const handleScroll = () => {
      // Verificamos si estamos en la parte superior de la página
      const atTop = window.scrollY < 50; // Ajusta este valor según necesites
      setIsAtTop(atTop);
    };

    // Agregamos el event listener cuando el componente se monta
    window.addEventListener("scroll", handleScroll);

    // Limpiamos el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

   

  const navigate = useNavigate();
    const handleHome = () => {
      navigate("");
    };
   const handleFiltro = (categoria,subCategoria) => {
    console.log(categoria,subCategoria);
      navigate("filtro/"+categoria+"/"+subCategoria);
    };

    const handleLogin=()=>{
       const storedId = localStorage.getItem('usuarioIdWeb');

      
      const usuarioId = storedId ? storedId : 0; 

      if (usuarioId) {
        navigate("cliente");
      } else {
        navigate("login");
      }

      
    }
    const handleCarrito=()=>{
      const storedId = localStorage.getItem('usuarioIdWeb');

      
      const usuarioId = storedId ? storedId : 0; 

      if (usuarioId) {
       navigate("carrito");
      } else {
        navigate("login");
      }
    }
   

     // 1. Estado para rastrear el error de carga del logo
  const [logoError, setLogoError] = useState(false);

  // 2. Función que se ejecuta si la imagen no se carga
  const handleLogoError = () => {
    setLogoError(true);
  };
    

  const logoSrc = "http://localhost:3000/uploads/" + configWeb.logoUrl;



  // 1. Estado para rastrear la categoría cuyo submenú debe mostrarse
  const [activeCategory, setActiveCategory] = useState(null); 

  // Función para manejar el hover (mouse entra)
  const handleMouseEnter = (categoriaId) => {
    setActiveCategory(categoriaId);
  };

  // Función para manejar el mouse sale (opcional, para ocultar el submenú)
  const handleMouseLeave = () => {
    // Retrasar el ocultamiento para permitir al usuario moverse al submenú
    setTimeout(() => {
      setActiveCategory(null);
    }, 200); 
  };
  
  // Función para manejar el click
  const handleClickCategory = (categoriaId, subcategoriaId = 0) => {
    // Si la categoría ya está abierta, la cerramos (toggle). Si no, la abrimos.
    setActiveCategory(activeCategory === categoriaId ? null : categoriaId);
    
    // Ejecutar la función de filtro si es necesario
    handleFiltro(categoriaId, subcategoriaId); 
  };


  return (
    <>
      <div className={`nav ${isAtTop ? "visible" : "hidden"}`} style={{backgroundColor:configWeb.colorPrimario}} >
        <div className="contenido">
          <div className="logo">{logoError ? (
        // Muestra el texto si hay un error
        <h2 style={{ color: configWeb.colorSecundario }}>
          {configWeb.nombreSitio}
        </h2>
      ) : (
        // Intenta mostrar la imagen
        <img 
          src={logoSrc}
          alt={configWeb.nombreSitio || "Logo"} // Es buena práctica usar un 'alt' descriptivo
          onClick={handleHome}
          // 3. Este atributo llama a handleLogoError si la imagen falla
          onError={handleLogoError}
        />
      )}
          </div>
          
        <div className="opciones">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="opcion-contenedor" // Nuevo contenedor para manejar el hover
                onMouseEnter={() => handleMouseEnter(categoria.id)} // Mostrar submenú al pasar el mouse
                onMouseLeave={handleMouseLeave} // Ocultar submenú al salir
              >
                <div
                  style={{color: configWeb.colorSecundario}} 
                  className="opcion"
                  // Usamos la función de click para abrir/cerrar y filtrar
                  onClick={() => handleClickCategory(categoria.id, 0)} 
                >
                  {categoria.nombre}
                </div>

                {/* 2. Renderizado Condicional de Subcategorías */}
                {/* Muestra las subcategorías si la categoría actual es la activa */}
                {activeCategory === categoria.id && categoria.subcategorias && (
                  <div className="subcategorias-menu">
                    {categoria.subcategorias.map((sub) => (
                      <div
                        key={sub.id}
                        className="subcategoria-item"
                        onClick={() => handleFiltro(categoria.id, sub.id)}
                        // Opcional: Ocultar el submenú al hacer click en una subcategoría
                       // onMouseDown={() => setActiveCategory(null)} 
                      >
                        {sub.nombre}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ... (Tu código de accesibilidad) ... */}
          <div className="accesibilidad">
            <div className="usuario"  onClick={handleLogin}>
              <UserIcon  color={configWeb.colorSecundario}></UserIcon>
            </div>
            <div className="carrito" onClick={handleCarrito}>
              <CartIcon  color={configWeb.colorSecundario}></CartIcon>
            </div>
            
          </div>
        </div>
      </div>
      <div className={`subNav ${!isAtTop ? "visible" : "hidden"}`}  style={{backgroundColor:configWeb.colorSecundario}} >
       {categorias.map((categoria) => (
          <div className="cateSub"  style={{color: configWeb.colorPrimario}} onClick={() => handleClickCategory(categoria.id, 0)} >
              {categoria.nombre}
          </div>

       ))}
      </div>
    </>
  );
};

export default Nav;
