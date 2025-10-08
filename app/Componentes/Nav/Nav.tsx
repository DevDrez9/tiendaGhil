import React, { useEffect, useState } from "react";

import "./Nav.css";

import { useNavigate } from "react-router";
import type { Categoria, ConfigWeb } from "~/Models/tiendaResponse.model";

interface NavProps {
  categorias: Categoria[];
  configWeb:ConfigWeb
  
}

const Nav: React.FC<NavProps> = ({ categorias, configWeb  }) => {
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
      navigate("filtro/"+categoria+"/"+subCategoria);
    };
   
    

  


  return (
    <>
      <div className={`nav ${isAtTop ? "visible" : "hidden"}`} style={{backgroundColor:configWeb.colorPrimario}} >
        <div className="contenido">
          <div>
<img src={configWeb.logoUrl}alt="" onClick={()=>handleHome()}/>
<h2>{configWeb.nombreSitio}</h2>
          </div>
          
          <div className="opciones">
            {categorias.map((categoria) => (
              <div

               style={{color:configWeb.colorSecundario}} 
                key={categoria.id}
                className="opcion"
                onClick={() => handleFiltro(categoria.id,0)}
              >
                {categoria.nombre}
              </div>
            ))}
          </div>

          <div className="accesibilidad">
            <div className="carrito">

            </div>
            <div className="usuario">
              
            </div>
          </div>
        </div>
      </div>
      <div className={`subNav ${!isAtTop ? "visible" : "hidden"}`}  style={{backgroundColor:configWeb.colorSecundario}} >
        {/* Contenido de tu sub navegación */}
        Sub navegación
      </div>
    </>
  );
};

export default Nav;
