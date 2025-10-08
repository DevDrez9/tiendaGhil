import React from "react";

import "./Footer.css";
import { useNavigate } from "react-router";
import type { ConfigWeb } from "~/Models/tiendaResponse.model";

interface FooterProps {
  
  configWeb: ConfigWeb;
 
}
const Footer: React.FC<FooterProps> = ({
 
  configWeb,

}) => {

     const handleClick = () => {
   
    // Siempre hacemos scroll al top
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Para un desplazamiento suave
    });
  };

   const navigate = useNavigate();
    const handleHome = () => {
      navigate("");
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
              <img src={configWeb.logoUrl} alt="" onClick={()=>handleHome()}/>
            </div>
            <div className="textoFooter">
              <div className="titulo">SIGUENOS EN:</div>
              <div className="redes">
                <div className="red"></div>
                <div className="red"></div>
                <div className="red"></div>
              </div>
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
