import React from "react";
import type { Producto } from "../../Models/Producto";

import BannerCarusel from "../../Componentes/Banner/BannerCarusel";
import CaruselCard from "../../Componentes/CaruselCard/CaruselCard";
import { useNavigate, useOutletContext } from "react-router";
import type { Route } from "./+types/HomePage";
import type { Banner } from "~/Models/tiendaResponse.model";
import { useProductosWeb } from "~/hooks/useProductos";

interface HomePageProps {
  banners: Banner[];
 
}

const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigate();


    const { nuevos, destacados, oferta, loadingProducto, errorProducto } = useProductosWeb(1);

     if (loadingProducto) {
    return <p>Cargando productos destacados...</p>;
  }

  if (errorProducto) {
    return <p>Error al cargar: {errorProducto.message}</p>;
  }


  


  const { banners } = useOutletContext<HomePageProps>();

  const handleCard = (producto: Producto) => {
    navigate("/producto/"+producto.id, { state: { producto } });
  };

  return (
    <>
      <BannerCarusel banners={banners} />
      <CaruselCard
        productos={oferta}
        titulo="Ofertas"
        onClickCard={handleCard}
      />
      <CaruselCard
        productos={destacados}
        titulo="Destacados"
        onClickCard={handleCard}
      />
      <CaruselCard
        productos={nuevos}
        titulo="Nuevos"
        onClickCard={handleCard}
      />
    </>
  );
};
export default HomePage;
