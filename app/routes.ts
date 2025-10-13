import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("./layouts/pagina.layout.tsx",[
        index("./Pages/HomePage/HomePage.tsx"),
        route("producto/:idProducto","./Pages/ProductoPage/ProductoPage.tsx"),
        
        route("filtro/:categoria/:subCategoria","./Pages/FiltroPage/FiltroPage.tsx"),
        route("login","./Pages/LoginUsuario/LoginUsuario.tsx"),
        route("registro","./Pages/RegistroPage/RegistroPage.tsx"),
         route("carrito","./Pages/Carrito/Carrito.tsx"),
         route("cliente","./Pages/PerfilCliente/PerfilCliente.tsx")
    
    ])
] satisfies RouteConfig;
