import React, { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router";
import "./FiltroPage.css"

import Card from "~/Componentes/Card/Card";
import type { Producto } from "~/Models/Producto";
import type { Categoria } from "~/Models/tiendaResponse.model";
import { useProductosPorFiltro } from "~/hooks/useProductos";


interface FiltroPageeProps {
    categorias:Categoria[];
    

}

const FiltroPage: React.FC<FiltroPageeProps> = ({categorias}) => {
    const { categoria, subCategoria } = useParams();
   

    const [imagenCate, setImagenCate]=useState(null); 

    const { data: productos, total, loadingProducto, error } = useProductosPorFiltro(
    +categoria,
    +subCategoria
  );
   
   
    const navigate = useNavigate();
    useEffect(() => {
        if(categoria=="0" && subCategoria=="0"){
            navigate("/");

        }
    }, [navigate, ])
    


const handleCard = (producto: Producto) => {
    navigate("/producto/"+producto.id, { state: { producto } });
  };

    return(<>
        <div className="contenidoFiltro">
            <div className="imagenCate">
               
            </div>
            <div className="cardsFiltro">
                {productos.map((producto)=>{
return <Card producto={producto}
onClickCard={handleCard}/>
                })}
                <div >

                </div>
                
            </div>
        </div>
        
    </>)
}

export default FiltroPage;