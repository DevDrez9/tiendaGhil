import React from 'react'

import "./Card.css"
import type { Producto } from '../../Models/Producto';


interface CardProps {
  producto: Producto;
  onClickCard?: (producto: Producto) => void;
};
const Card: React.FC<CardProps> = ({ producto,onClickCard }) => {
    return(
      <>
     
     <div className="card" onClick={() => onClickCard && onClickCard(producto)}>
       <div className="img">
         {producto.imagenes.length > 0 ? (
        <img src={producto.imagenes[0].url?"http://localhost:3000/uploads/productos/"+producto.imagenes[0].url:""} alt="" />
         ) : (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      color: "#999",
                      fontSize: "12px",
                      textAlign: "center"
                    }}
                  >
                    Sin Imagen
                  </div>
                )}</div>
       <div className="contenidoCard">
        <div className="estado">
           {producto.esNuevo && (<div className="nuevo">NUEVO</div>)}
           {producto.enOferta && (<div className="oferta">OFERTA</div>)}
            {producto.esDestacado && (<div className="nuevo">Destacado</div>)}

        </div>
        <div className="nombre">
          {producto.nombre}
        </div>
        <div className="precio">
          Bs {producto.precio} 
        </div>
       </div>
     </div>

     </>
    );

}
export default Card
