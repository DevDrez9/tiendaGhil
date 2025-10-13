// 1. Define tu componente de ícono (ej. UserIcon.jsx)
// Asegúrate de usar camelCase para los atributos (strokeLinecap, fillRule, etc.)
const UserIcon = ({ color }) => {
  return (
    <svg 
      id='User_Male_24' 
      width='24' 
      height='24' 
      viewBox='0 0 24 24' 
      xmlns='http://www.w3.org/2000/svg' 
    >
      <rect width='24' height='24' stroke='none' fill='none' opacity='0'/>

      <g transform="matrix(0.83 0 0 0.83 12 12)">
        <path 
          style={{
            // Aquí reemplazas el color fijo (ej. rgb(0,0,0)) por la variable 'color'
            fill: color, 
            stroke: 'none', 
            // ... (otros estilos)
            fillRule: 'nonzero', 
            strokeLinecap: 'round', // camelCase
          }} 
          transform=" translate(-15, -15)" 
          d="M 18 19 L 18 17 C 18.45 16.777 19.737000000000002 15.245000000000001 19.872 14.048 C 20.226 14.021 20.782 13.696 20.946 12.413 C 21.034000000000002 11.724 20.684 11.337 20.472 11.215 C 20.472 11.215 21 10.212 21 9.001 C 21 6.5729999999999995 20.047 4.5009999999999994 18 4.5009999999999994 C 18 4.5009999999999994 17.289 3.0009999999999994 15 3.0009999999999994 C 10.758 3.0009999999999994 9 5.7219999999999995 9 9.001 C 9 10.105 9.528 11.215 9.528 11.215 C 9.316 11.337 8.966000000000001 11.725 9.054 12.413 C 9.218 13.696 9.774000000000001 14.021 10.128 14.048 C 10.263 15.245 11.55 16.777 12 17 L 12 19 C 11 22 3 20 3 27 L 27 27 C 27 20 19 22 18 19 z"
        />
      </g>
    </svg>
  );
};
export  default UserIcon;