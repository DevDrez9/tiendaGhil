import React, { useState } from "react";

import "./Footer.css";
import { useNavigate } from "react-router";
import type { Categoria, ConfigWeb } from "~/Models/tiendaResponse.model";

interface FooterProps {
  categorias: Categoria[];

  configWeb: ConfigWeb;
}
const Footer: React.FC<FooterProps> = ({ categorias, configWeb }) => {
  const handleClick = () => {
    // Siempre hacemos scroll al top
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Para un desplazamiento suave
    });
  };

  const navigate = useNavigate();
  const handleHome = () => {
    navigate("");
  };
   // 1. Estado para rastrear la categoría cuyo submenú debe mostrarse
    const [activeCategory, setActiveCategory] = useState(null); 

     const handleFiltro = (categoria,subCategoria) => {
    console.log(categoria,subCategoria);
      navigate("filtro/"+categoria+"/"+subCategoria);
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
      <footer
        style={{
          backgroundColor: configWeb.colorPrimario,
          color: configWeb.colorSecundario,
        }}
      >
        <div className="contenidoFooter">
          <div style={{ display: "flex", height: "100%" }}>
            <div className="logo">
              <img
                src={"http://localhost:3000/uploads/" + configWeb.logoUrl}
                alt=""
                onClick={() => handleHome()}
              />
            </div>
            <div className="textoFooter">
              {categorias.map((categoria) => (
                <div className="categoria">
                  <div onClick={() => handleClickCategory(categoria.id, 0)} >{categoria.nombre}</div>
                  <div className="subCategorias">
                    {categoria.subcategorias.map((sub) => (
                      <div className="subCategoria">
                        <div  onClick={() => handleFiltro(categoria.id, sub.id)}>{sub.nombre}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          </div>
          <div className="botonArriba" onClick={handleClick}>
            ^
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
